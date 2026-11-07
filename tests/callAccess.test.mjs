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
    findContractor:async () => ({ name:'Sierra Robinson', campaigns:['assigned'], dailyCallGoal:120 }),
    process:{ env:{ NODE_ENV:'production' } },
    URL,
  };
  vm.runInNewContext(`${accessSource}\nthis.principal = currentOperationsPrincipal;`, context);
  const cookies = 'admin_session=admin; bdr_session=contractor';
  assert.equal((await context.principal({ headers:{ cookie:cookies } })).role, 'admin');
  const bdr = await context.principal({ headers:{ cookie:cookies, 'x-onyx-workspace':'bdr' } });
  assert.equal(bdr.role, 'contractor');
  assert.equal(bdr.email, 'sierra@example.com');
  assert.equal(bdr.name, 'Sierra Robinson');
  assert.deepEqual(Array.from(bdr.campaignIds), ['assigned']);
  assert.equal(await context.principal({ headers:{ cookie:'admin_session=admin', 'x-onyx-workspace':'bdr' } }), null);
  const legacyBdr = { cookie:cookies, host:'www.onyxcreativelabs.com', referer:'https://www.onyxcreativelabs.com/bdr?campaign=assigned' };
  assert.equal((await context.principal({ headers:legacyBdr })).role, 'contractor');
  assert.equal((await context.principal({ headers:{ ...legacyBdr, cookie:'admin_session=admin' } })), null);
  assert.equal((await context.principal({ headers:{ ...legacyBdr, referer:'https://www.onyxcreativelabs.com/dialer/admin/index.html' } })).role, 'admin');
  assert.equal((await context.principal({ headers:{ ...legacyBdr, referer:'https://other.example/bdr' } })).role, 'admin');
});

async function handlerTest(file, principal, query = {}, body) {
  const source = (await readFile(new URL(file, import.meta.url), 'utf8')).replace(/import[\s\S]*?from '[^']+';/g, '').replace(/export default async function \w+/, 'async function handler');
  const seen = [];
  const accessChecks = [];
  const context = {
    currentOperationsPrincipal:async () => principal,
    allowedCampaignIds:(p) => p.role === 'admin' ? ['assigned','other'] : ['assigned'],
    listCampaigns:async () => [{id:'assigned'}, {id:'other'}],
    listPipeline:async (campaignIds, viewerEmail) => { seen.push({ campaignIds, viewerEmail }); return []; },
    listQueueResumePositions:async (campaignIds, actorEmail) => { seen.push({campaignIds,actorEmail}); return [{campaign_id:'assigned',lead_id:'last-saved-call'}]; },
    listCampaignSummaries:async () => [],
    isAdminMasterSynced:async () => false,
    SALES_PIPELINE_LANES:[],
    listCallHistory:async (value) => { seen.push(value); return { calls:[], total:0 }; },
    listAppointments:async (campaignIds, viewerEmail) => { seen.push({ campaignIds, viewerEmail }); return []; },
    hasCampaignAccess:(p, id) => p.role === 'admin' || p.campaignIds.includes(id),
    getContractorDailyDashboard:async (value) => { seen.push(value); return {}; },
    getContractorCallReport:async (value) => { seen.push(value); return {}; },
    getLeadDetail:async (id, campaignIds, viewerEmail) => { accessChecks.push({ id, campaignIds, viewerEmail }); return campaignIds.includes(id) ? { lead:{ id } } : null; },
    recordLeadActivity:async (value) => { seen.push(value); return value; },
    console, Intl, Date, String,
  };
  vm.runInNewContext(`${source}\nthis.handler = handler;`, context);
  const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.body = data; return this; } };
  await context.handler({ method:body ? 'POST' : 'GET', query, body }, res);
  return { res, seen, accessChecks };
}
const contractor = { role:'contractor', email:'sierra@example.com', name:'Sierra Robinson', campaignIds:['assigned'] };
test('call history shares all callers within assigned campaigns; report is Admin-only', async () => {
  const history = await handlerTest('../pages/api/operations/calls.js', contractor, { actorEmail:'other@example.com', campaign:'assigned' });
  assert.equal(history.res.code, 200);
  assert.equal(history.seen[0].actorEmail, '', 'a caller filter cannot hide teammates from shared campaign history');
  assert.equal(history.seen[0].viewerEmail, contractor.email, 'booking privacy uses the authenticated viewer');
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

test('BDR workspace returns only campaigns saved in contractor access', async () => {
  const { res, seen } = await handlerTest('../pages/api/operations/workspace.js', contractor);
  assert.equal(res.code, 200);
  assert.deepEqual(Array.from(res.body.campaigns, (campaign) => campaign.id), ['assigned']);
  assert.deepEqual(Array.from(seen[0].campaignIds), ['assigned']);
  assert.equal(seen[0].viewerEmail, contractor.email);
  assert.equal(seen[1].actorEmail, contractor.email);
  assert.deepEqual(Array.from(seen[1].campaignIds), ['assigned']);
  assert.equal(res.body.queueResumePositions[0].lead_id, 'last-saved-call');
  assert.equal(res.body.principal.name, contractor.name);
});

test('every contractor read and activity write passes the authenticated booking viewer', async () => {
  const forgedQuery = { id:'assigned', campaign:'assigned', viewerEmail:'other@example.com' };
  const detail = await handlerTest('../pages/api/operations/leads/[id].js', contractor, forgedQuery);
  assert.equal(detail.res.code, 200);
  assert.equal(detail.accessChecks[0].viewerEmail, contractor.email);
  const write = await handlerTest('../pages/api/operations/activities.js', contractor, {}, { leadId:'assigned', activityType:'note', viewerEmail:'other@example.com' });
  assert.equal(write.accessChecks[0].viewerEmail, contractor.email);
  const appointments = await handlerTest('../pages/api/operations/appointments.js', contractor, forgedQuery);
  assert.equal(appointments.seen[0].viewerEmail, contractor.email);
  const dashboard = await handlerTest('../pages/api/operations/dashboard.js', contractor, forgedQuery);
  assert.equal(dashboard.seen[0].viewerEmail, contractor.email);
  const admin = await handlerTest('../pages/api/operations/leads/[id].js', { role:'admin', email:'admin@example.com' }, { id:'assigned' });
  assert.equal(admin.accessChecks[0].viewerEmail, '', 'only an authenticated Admin gets the unrestricted view');
});

test('the removed contractor uploader cannot create lead batches through an old endpoint', async () => {
  const result = await handlerTest('../pages/api/operations/contractor-lead-import.js', contractor, {}, { campaignId:'assigned', csv:'Name,Email\nPerson,person@example.com' });
  assert.equal(result.res.code, 410);
  assert.equal(result.seen.length, 0);
});
