import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const accessSource = (await readFile(new URL('../lib/operationsAccess.js', import.meta.url), 'utf8')).replace(/import[\s\S]*?from '[^']+';/g, '').replace(/export /g, '');
test('BDR requests keep contractor identity and access when an Admin session is also open', async () => {
  const context = {
    isAllowedAdmin:() => true, normaliseEmail:(email) => email.toLowerCase(),
    readSessionToken:(token, role) => token === role ? { email:role === 'admin' ? 'admin@example.com' : 'sierra@example.com' } : null,
    isActiveContractor:async () => true,
    findContractor:async () => ({ campaigns:['assigned'], dailyCallGoal:120 }),
    process:{ env:{ NODE_ENV:'production' } },
  };
  vm.runInNewContext(`${accessSource}\nthis.principal = currentOperationsPrincipal;`, context);
  const cookies = 'admin_session=admin; bdr_session=contractor';
  assert.equal((await context.principal({ headers:{ cookie:cookies } })).role, 'admin');
  const bdr = await context.principal({ headers:{ cookie:cookies, 'x-onyx-workspace':'bdr' } });
  assert.equal(bdr.role, 'contractor');
  assert.equal(bdr.email, 'sierra@example.com');
  assert.deepEqual(Array.from(bdr.campaignIds), ['assigned']);
  assert.equal(await context.principal({ headers:{ cookie:'admin_session=admin', 'x-onyx-workspace':'bdr' } }), null);
});

async function handlerTest(file, principal, query = {}, body) {
  const source = (await readFile(new URL(file, import.meta.url), 'utf8')).replace(/import[\s\S]*?from '[^']+';/g, '').replace(/export default async function \w+/, 'async function handler');
  const seen = [];
  const context = {
    currentOperationsPrincipal:async () => principal,
    allowedCampaignIds:(p) => p.role === 'admin' ? ['assigned','other'] : ['assigned'],
    listCampaigns:async () => [],
    listCallHistory:async (value) => { seen.push(value); return { calls:[], total:0 }; },
    getContractorCallReport:async (value) => { seen.push(value); return {}; },
    getLeadDetail:async (id, campaignIds) => campaignIds.includes(id) ? { lead:{ id } } : null,
    recordLeadActivity:async (value) => { seen.push(value); return value; },
    console, Intl, Date, String,
  };
  vm.runInNewContext(`${source}\nthis.handler = handler;`, context);
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.body = data; return this; } };
  await context.handler({ method:body ? 'POST' : 'GET', query, body }, res);
  return { res, seen };
}
const contractor = { role:'contractor', email:'sierra@example.com', campaignIds:['assigned'] };
test('call history is scoped to the signed-in BDR and campaign; report is Admin-only', async () => {
  const history = await handlerTest('../pages/api/operations/calls.js', contractor, { actorEmail:'other@example.com', campaign:'assigned' });
  assert.equal(history.res.code, 200);
  assert.equal(history.seen[0].actorEmail, 'sierra@example.com');
  assert.deepEqual(Array.from(history.seen[0].campaignIds), ['assigned']);
  assert.equal((await handlerTest('../pages/api/operations/calls.js', contractor, { campaign:'other' })).res.code, 403);
  assert.equal((await handlerTest('../pages/api/operations/calls.js', null)).res.code, 401);
  assert.equal((await handlerTest('../pages/api/admin/call-report.js', contractor)).res.code, 403);
  assert.equal((await handlerTest('../pages/api/admin/call-report.js', { role:'admin' }, { from:'2026-02-30' })).res.code, 400);
  assert.equal((await handlerTest('../pages/api/admin/call-report.js', { role:'admin' }, { from:'2026-11-05', to:'2026-11-05' })).res.code, 200);
});
test('call writes use the authenticated actor, never the client-provided actor', async () => {
  const allowed = await handlerTest('../pages/api/operations/activities.js', contractor, {}, { leadId:'assigned', actorEmail:'forged@example.com', actorRole:'admin', activityType:'call' });
  assert.equal(allowed.res.code, 201);
  assert.equal(allowed.seen[0].actorEmail, 'sierra@example.com');
  assert.equal(allowed.seen[0].actorRole, 'contractor');
  const denied = await handlerTest('../pages/api/operations/activities.js', contractor, {}, { leadId:'other', activityType:'call' });
  assert.equal(denied.res.code, 404);
  assert.equal(denied.seen.length, 0);
});
