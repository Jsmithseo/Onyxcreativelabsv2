import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import vm from 'node:vm';
import { gzipSync, gunzipSync } from 'node:zlib';

const storeSource=(await readFile(new URL('../lib/operationsStore.js',import.meta.url),'utf8'))
 .replace("import { neon } from '@neondatabase/serverless';", "const neon=()=>{throw new Error('Isolated database required');};")
 .replace("import { listContractors } from './contractorStore';",'const listContractors=async()=>[];')
 .replace(/from '(\.\/[^']+\.mjs)'/g,(_,path)=>`from '${new URL('../lib/'+path.slice(2),import.meta.url).href}'`);
const store=await import('data:text/javascript;base64,'+Buffer.from(storeSource).toString('base64'));

test('Admin master sync preserves existing work and keeps distinct leads with blank-email placeholders',async()=>{
 const db=new PGlite();
 const migration=await readFile(new URL('../scripts/migrate-shared-operations.mjs',import.meta.url),'utf8');
 const schema=migration.slice(migration.indexOf('const statements = ['),migration.indexOf('for (const statement'));
 const {statements}=await import('data:text/javascript;base64,'+Buffer.from(schema+'\nexport {statements};').toString('base64'));
 for(const sql of statements) await db.exec(sql);
 store.setOperationsDatabaseForTests(db);
 try {
  await db.query("INSERT INTO campaigns(id,name) VALUES ('test','Test')");
  await db.query("INSERT INTO leads(id,campaign_id,source_key,name,phone,stage,notes,follow_up_owner_email) VALUES ('existing','test','existing','Existing lead','4155550100','Appointment Set','Keep history and script','sierra@example.com')");
  await db.query("INSERT INTO lead_activities(id,lead_id,campaign_id,actor_email,actor_role,activity_type,note) VALUES ('booking','existing','test','sierra@example.com','contractor','appointment','Calendly confirmed')");
  const snapshot={campaigns:[{id:'test',name:'Test'}],leads:[
   {sharedLeadId:'existing',campaign:'test',name:'Stale browser name',stage:'New',notes:'Stale browser notes',assignedTo:null},
   {campaign:'test',name:'First legacy lead',company:'Same company',email:'—',phone:'4155550101',source:'Admin',notes:'First script'},
   {campaign:'test',name:'Second legacy lead',company:'Same company',email:'—',phone:'4155550102',source:'Admin',notes:'Second script'},
  ]};
  assert.equal(await store.isAdminMasterSynced(),false);
  const preview=await store.previewAdminCampaignSync(snapshot);
  assert.equal(preview.ready,true);
  assert.equal(preview.candidate_count,2);
  assert.equal(preview.duplicate_count,0);
  const incomplete=await store.previewAdminCampaignSync({...snapshot,leads:snapshot.leads.slice(1)});
  assert.equal(incomplete.ready,false);
  assert.equal(incomplete.missing_shared_count,1);
  await assert.rejects(store.syncAdminCampaigns(snapshot,'wrong-hash'),/Preview/);
  await store.syncAdminCampaigns(snapshot,preview.preview_hash);
  assert.equal(await store.isAdminMasterSynced(),true);
  const rows=(await db.query('SELECT * FROM leads ORDER BY name')).rows;
  assert.equal(rows.length,3);
  const original=rows.find(row=>row.id==='existing');
  assert.equal(original.name,'Existing lead');
  assert.equal(original.stage,'Appointment Set');
  assert.equal(original.notes,'Keep history and script');
  assert.equal(original.follow_up_owner_email,'sierra@example.com');
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM lead_activities')).rows[0].count,1);
  assert.equal((await store.listPipeline(['test'])).find(row=>row.id==='existing').pipeline_eligible,true);
  await store.syncAdminCampaigns(snapshot,preview.preview_hash);
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM leads')).rows[0].count,3,'retries cannot duplicate imported leads');
 } finally {store.setOperationsDatabaseForTests(null);await db.close();}
});

const endpointSource=(await readFile(new URL('../pages/api/operations/admin-campaign-sync.js',import.meta.url),'utf8')).replace(/import[\s\S]*?from '[^']+';/g,'').replace('export const config','const config').replace('export default async function adminCampaignSync','async function handler');
async function syncRequest(role,body,backupFails=false) {
 const events=[];
 const context={currentOperationsPrincipal:async()=>role?{role,email:'admin@example.com'}:null,
  previewAdminCampaignSync:async()=>({ready:true,preview_hash:'hash'}),
  put:async()=>{events.push('backup');if(backupFails)throw new Error('Backup unavailable');},
  syncAdminCampaigns:async()=>{events.push('sync');return {leads:2};},console:{error(){}}};
 vm.runInNewContext(endpointSource+'\nthis.handler=handler;',context);
 const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
 await context.handler({method:'POST',body},res);
 return {events,res};
}
test('the Admin sync endpoint requires preview and writes a private backup before importing',async()=>{
 const snapshot={campaigns:[],leads:[],previewHash:'hash'};
 assert.equal((await syncRequest('contractor',snapshot)).res.code,403);
 assert.deepEqual((await syncRequest('admin',{...snapshot,preview:true})).events,[]);
 assert.equal((await syncRequest('admin',{...snapshot,previewHash:'wrong'})).res.code,409);
 assert.deepEqual((await syncRequest('admin',snapshot)).events,['backup','sync']);
 const failed=await syncRequest('admin',snapshot,true);
 assert.equal(failed.res.code,503);
 assert.deepEqual(failed.events,['backup'],'backup failure must stop the import');
});

test('large shared workspaces remain readable through a compressed JSON response',async()=>{
 const source=(await readFile(new URL('../pages/api/operations/workspace.js',import.meta.url),'utf8')).replace(/import[\s\S]*?from '[^']+';/g,'').replace('export default async function workspace','async function handler');
 const context={currentOperationsPrincipal:async()=>({role:'contractor',email:'bdr@example.com'}),allowedCampaignIds:()=>['test'],listCampaigns:async()=>[{id:'test'}],listPipeline:async()=>[{id:'lead',notes:'x'.repeat(1100000)}],listQueueResumePositions:async()=>[],listCampaignSummaries:async()=>[],isAdminMasterSynced:async()=>true,SALES_PIPELINE_LANES:[['appointments','Booked appointments']],gzipSync,Buffer,console};
 vm.runInNewContext(source+'\nthis.handler=handler;',context);
 const headers={};
 const res={setHeader(key,value){headers[key]=value;},status(code){this.code=code;return this;},end(value){this.buffer=value;return this;},json(){throw new Error('Expected gzip for large workspace');}};
 await context.handler({method:'GET',headers:{'accept-encoding':'gzip, deflate'}},res);
 assert.equal(res.code,200);
 assert.equal(headers['Content-Encoding'],'gzip');
 assert.equal(JSON.parse(gunzipSync(res.buffer)).leads[0].notes.length,1100000);
});
