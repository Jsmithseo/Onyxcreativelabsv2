import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const handlerSource = (await readFile(new URL('../pages/api/operations/leads/[id].js', import.meta.url), 'utf8'))
  .replace(/import[\s\S]*?from '\.\.\/\.\.\/\.\.\/\.\.\/lib\/operationsAccess';/, '')
  .replace(/import[^\n]+from '\.\.\/\.\.\/\.\.\/\.\.\/lib\/operationsStore';/, '')
  .replace('export default async function lead', 'async function handler');

async function request(method, role, body) {
  const writes = [];
  const response = { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; }, setHeader() {} };
  const context = {
    currentOperationsPrincipal:async () => role ? { role, email:'user@example.com' } : null,
    allowedCampaignIds:() => ['campaign-1'],
    listCampaigns:async () => [{ id:'campaign-1' }],
    getLeadDetail:async () => ({ lead:{ id:'shared-lead-1', campaign_id:'campaign-1' }, activities:[] }),
    updateLeadProfile:async (payload) => { writes.push(payload); return payload; },
    console,
  };
  vm.runInNewContext(`${handlerSource}\nthis.handler = handler;`, context);
  await context.handler({ method, query:{ id:'shared-lead-1' }, body }, response);
  return { response, writes };
}

test('contractor and unauthenticated requests cannot overwrite shared lead profiles', async () => {
  for (const [role, code] of [['contractor',403], [null,401]]) {
    const { response, writes } = await request('PATCH', role, { name:'Changed', notes:'Changed' });
    assert.equal(response.code, code);
    assert.equal(writes.length, 0);
  }
});

test('admin profile updates require valid complete text and use the resolved shared lead ID', async () => {
  const invalid = await request('PATCH', 'admin', { name:'Name' });
  assert.equal(invalid.response.code, 400);
  assert.equal(invalid.writes.length, 0);
  const valid = await request('PATCH', 'admin', { name:'Name', notes:'Full briefing and script', previousName:'Name', previousNotes:'' });
  assert.equal(valid.response.code, 200);
  assert.equal(valid.writes[0].leadId, 'shared-lead-1');
});

test('contractors retain read access to shared lead details', async () => {
  const { response, writes } = await request('GET', 'contractor');
  assert.equal(response.code, 200);
  assert.equal(response.body.lead.id, 'shared-lead-1');
  assert.equal(writes.length, 0);
});
