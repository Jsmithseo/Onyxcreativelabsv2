import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { PGlite } from '@electric-sql/pglite';
import { createWorkspaceMetadataStore, workspaceMetadataSchema } from '../lib/workspaceMetadata.mjs';
import { collectWorkspaceMetadata, importWorkspaceMetadata } from '../scripts/migrate-workspace-metadata.mjs';

const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const metadataSource = (await readFile(new URL('../lib/workspaceMetadata.mjs', import.meta.url), 'utf8'))
  .replace("import { neon } from '@neondatabase/serverless';", "const neon = () => { throw new Error('Test database required'); };")
  .replace('let client;', 'let client; export function useTestDatabase(sql) { client = sql; }');
const metadataUrl = asModule(metadataSource);
const metadata = await import(metadataUrl);
const authUrl = asModule(await readFile(new URL('../lib/bdrAuth.js', import.meta.url), 'utf8'));
const contractorSource = (await readFile(new URL('../lib/contractorStore.js', import.meta.url), 'utf8'))
  .replace("'./workspaceMetadata.mjs'", JSON.stringify(metadataUrl))
  .replace("'./bdrAuth'", JSON.stringify(authUrl));
const contractors = await import(asModule(contractorSource));
const keyFor = (email) => `contractors/${crypto.createHash('sha256').update(email).digest('hex')}.json`;
const profile = { id:'existing-id', name:'Existing contractor', email:'rep@example.com', phone:'5550100', notes:'Keep notes', campaigns:['school','reviews'], dailyCallGoal:80, dailyAppointmentGoal:2, status:'invited', createdAt:1000, invitedAt:2000, invitedBy:'owner@example.com' };

test('contractor recovery preserves identities, assignments and goals; edits remain durable without Blob', async () => {
  const db = new PGlite();
  await db.exec(workspaceMetadataSchema);
  metadata.useTestDatabase(db);
  try {
    const records = createWorkspaceMetadataStore(db);
    await records.write(keyFor(profile.email), profile);
    await records.write('admin/dashboard-settings.json', { voipProvider:'Telnyx' });
    assert.deepEqual(await contractors.findContractor(' REP@example.com '), profile);
    assert.deepEqual(await contractors.listContractors(), [profile]);
    const saved = await contractors.saveContractor({ name:profile.name, email:profile.email, phone:profile.phone, campaigns:profile.campaigns, sendInvitation:false });
    assert.deepEqual(saved, profile, 'saving an existing profile must retain original identity, history, notes and goals');
    await contractors.markInvitationFailed(profile.email);
    assert.equal((await contractors.findContractor(profile.email)).status, 'invite_failed');
    assert.deepEqual((await records.list('contractors/')).map(row => row.key), [keyFor(profile.email)]);
    assert.equal((await records.read('admin/dashboard-settings.json')).voipProvider, 'Telnyx');
    assert.equal(await contractors.findContractor('missing@example.com'), null);
    await db.exec('DROP TABLE workspace_metadata');
    await assert.rejects(contractors.listContractors(), /workspace_metadata/, 'a database outage cannot appear as an empty roster');
  } finally { metadata.useTestDatabase(null); await db.close(); }
});

test('recovery imports every record atomically and reruns preserve newer database edits', async () => {
  const db = new PGlite();
  const sql = {
    query: (text, values = []) => ({text, values}),
    transaction: (queries) => db.transaction(async (tx) => {
      for (const query of queries) await tx.query(query.text, query.values);
    }),
  };
  try {
    await importWorkspaceMetadata(sql, [{key:keyFor(profile.email), value:profile}]);
    const records = createWorkspaceMetadataStore(db);
    const updated = {...profile, campaigns:['reviews'], dailyCallGoal:95};
    await records.write(keyFor(profile.email), updated);
    await importWorkspaceMetadata(sql, [{key:keyFor(profile.email), value:profile}]);
    assert.deepEqual(await records.read(keyFor(profile.email)), updated);
    await assert.rejects(importWorkspaceMetadata(sql, [{key:'bad-record',value:{}}, {key:null,value:{}}]));
    assert.equal(await records.read('bad-record'), null, 'a failed transaction cannot partially import records');
  } finally { await db.close(); }
});

test('recovery refuses inaccessible or malformed source records', async () => {
  const listBlobs = async () => ({blobs:[{pathname:keyFor(profile.email)}],hasMore:false});
  await assert.rejects(collectWorkspaceMetadata({listBlobs, readBlob:async()=>{throw new Error('403 Forbidden');}}), /403/);
  await assert.rejects(collectWorkspaceMetadata({listBlobs, readBlob:async()=>null}), /could not be recovered/);
  await assert.rejects(collectWorkspaceMetadata({listBlobs, readBlob:async()=>({statusCode:200,stream:new Response(JSON.stringify({...profile,email:'wrong@example.com'})).body})}), /invalid/);
  const source = {...profile, extraField:'retain full source record'};
  const recovered = await collectWorkspaceMetadata({listBlobs, readBlob:async(path)=>path.startsWith('contractors/') ? {statusCode:200,stream:new Response(JSON.stringify(source)).body} : null});
  assert.deepEqual(recovered, [{key:keyFor(profile.email),value:source}]);
});

test('the admin roster shows a load error instead of zero contractors and recovers on retry', async () => {
  const source = await readFile(new URL('../public/dialer/admin/app.js', import.meta.url), 'utf8');
  const controls = new Map();
  const control = (id) => {
    if (!controls.has(id)) controls.set(id, {textContent:'',innerHTML:'',disabled:false,querySelectorAll:()=>[]});
    return controls.get(id);
  };
  let fails = true;
  const context = {
    document:{getElementById:control}, campaigns:[{id:'school',name:'School'}], contractors:[], contractorLoadState:'loading',
    escapeHtml:String, notify(){},
    fetch:async()=>({ok:!fails,json:async()=>({contractors:[profile]})}),
  };
  const render = source.slice(source.indexOf('function renderContractors()'), source.indexOf('function openContractorForm('));
  const load = source.slice(source.indexOf('async function loadContractors()'), source.indexOf('function renderCallHistory()'));
  vm.runInNewContext(`${render}\n${load}\nthis.load = loadContractors;`, context);
  await context.load();
  assert.equal(control('contractorCount').textContent, 'Contractor list unavailable');
  assert.match(control('contractorRows').innerHTML, /does not mean the accounts or assignments were removed/);
  assert.equal(control('showContractorForm').disabled, true);
  fails = false;
  await context.load();
  assert.equal(control('contractorCount').textContent, '1 contractor');
  assert.match(control('contractorRows').innerHTML, /Existing contractor/);
  assert.equal(control('showContractorForm').disabled, false);
});
