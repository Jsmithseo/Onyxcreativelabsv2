import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { belongsInCallQueue, nextQueueLead } from '../lib/callQueue.mjs';
import { hasBookedAppointment, salesPipelineLane } from '../lib/salesPipeline.mjs';

const roster = [{ name:'Sierra', email:'sierra@example.com' }, { name:'Jeremy', email:'jeremy@example.com' }];
const storeSource = (await readFile(new URL('../lib/operationsStore.js', import.meta.url), 'utf8'))
  .replace("import { neon } from '@neondatabase/serverless';", "const neon = () => { throw new Error('Only an isolated test database is allowed'); };")
  .replace("import { listContractors } from './contractorStore';", `const listContractors = async () => ${JSON.stringify(roster)};`)
  .replace(/from '(\.\/[^']+\.mjs)'/g, (_, path) => `from '${new URL('../lib/' + path.slice(2), import.meta.url).href}'`);
const store = await import(`data:text/javascript;base64,${Buffer.from(storeSource).toString('base64')}`);

test('manual calls persist, leave the queue, and feed BDR history and the Admin contractor report', async () => {
  const db = new PGlite();
  const migration = await readFile(new URL('../scripts/migrate-shared-operations.mjs', import.meta.url), 'utf8');
  const schema = migration.slice(migration.indexOf('const statements = ['), migration.indexOf('for (const statement'));
  const { statements } = await import(`data:text/javascript;base64,${Buffer.from(schema + '\nexport { statements };').toString('base64')}`);
  for (const sql of statements) await db.exec(sql);
  store.setOperationsDatabaseForTests(db);
  try {
    await db.query("INSERT INTO campaigns(id,name) VALUES ('test','Test campaign'),('other','Other campaign')");
    await db.query("INSERT INTO leads(id,campaign_id,source_key,name,notes,follow_up_owner_email) VALUES ('a','test','a','Test lead A','Original briefing','sierra@example.com'),('b','test','b','Test lead B','','jeremy@example.com'),('c','other','c','Other lead','','jeremy@example.com')");
    await store.recordLeadActivity({ leadId:'a', actorEmail:'sierra@example.com', actorRole:'contractor', activityType:'note', note:'Note only', durationSeconds:0 });
    assert.equal(belongsInCallQueue((await store.listPipeline(['test'])).find((lead) => lead.id === 'a')), true);
    const call = await store.recordLeadActivity({ leadId:'a', actorEmail:'sierra@example.com', actorRole:'contractor', activityType:'call', note:'Requested a callback', durationSeconds:0, nextStage:'New' });
    assert.equal(call.lead.stage, 'Contacted');
    assert.equal(call.activity.resulting_stage, 'Contacted');
    assert.equal(call.lead.follow_up_owner_email, 'sierra@example.com');
    assert.equal(call.lead.notes, 'Original briefing\n\nNote only\n\nRequested a callback');
    const leads = await store.listPipeline(['test']);
    const a = leads.find((lead) => lead.id === 'a');
    assert.equal(a.last_called_by, 'sierra@example.com');
    assert.equal(a.call_count, 1);
    assert.equal(belongsInCallQueue(a), false);
    assert.equal(a.pipeline_eligible, false, 'calling a lead is not a booking');
    const own = await store.listCallHistory({ campaignIds:['test'], actorEmail:'sierra@example.com' });
    const admin = await store.listCallHistory({ campaignIds:['test'], contractorsOnly:true });
    assert.equal(own.total, 1);
    assert.deepEqual(own.calls, admin.calls);
    assert.equal(own.calls[0].duration_seconds, 0, 'manual log does not fabricate a duration');
    assert.equal((await store.listCallHistory({ campaignIds:['test'], actorEmail:'jeremy@example.com' })).total, 0);
    assert.equal((await store.listCallHistory({ campaignIds:['other'] })).total, 0);
    assert.equal((await store.listCallHistory({ campaignIds:['test'], offset:1 })).calls.length, 0);
    const today = new Intl.DateTimeFormat('en-CA', { timeZone:'America/Los_Angeles' }).format(new Date());
    let report = await store.getContractorCallReport({ campaignIds:['test'], from:today, to:today });
    assert.equal(report.totals.calls, 1);
    assert.equal(report.contractors.find((row) => row.email === 'sierra@example.com').calls, 1);
    assert.equal(report.contractors.find((row) => row.email === 'jeremy@example.com').calls, 0);
    assert.equal(report.totals.outcomes, 0);
    assert.equal(report.totals.talk_seconds, 0);
    const due = new Date(Date.now() + 3600000).toISOString();
    await store.recordLeadActivity({ leadId:'a', actorEmail:'sierra@example.com', actorRole:'contractor', activityType:'call', disposition:'Connected — follow up', scheduledFor:due, durationSeconds:30 });
    const callback = (await store.listPipeline(['test'])).find((lead) => lead.id === 'a');
    assert.equal(belongsInCallQueue(callback), false);
    assert.equal(belongsInCallQueue(callback, Date.parse(due) + 1), true);
    await store.recordLeadActivity({ leadId:'a', actorEmail:'sierra@example.com', actorRole:'contractor', activityType:'appointment', note:'Booked Calendly appointment', scheduledFor:due, nextStage:'Appointment Set' });
    let booked = (await store.listPipeline(['test'])).find((lead) => lead.id === 'a');
    assert.equal(booked.pipeline_eligible, true);
    assert.equal(booked.pipeline_lane, 'appointments');
    assert.equal(belongsInCallQueue(booked), false);
    await store.recordLeadActivity({ leadId:'a', actorEmail:'admin@example.com', actorRole:'admin', activityType:'stage_change', nextStage:'Pitched' });
    booked = (await store.listPipeline(['test'])).find((lead) => lead.id === 'a');
    assert.equal(booked.pipeline_lane, 'pitched');
    assert.equal(booked.follow_up_owner_email, 'sierra@example.com');
    report = await store.getContractorCallReport({ campaignIds:['test'], from:today, to:today });
    assert.deepEqual(report.totals, { calls:2, outcomes:1, connected:1, talk_seconds:30, appointments:1 });
    const dashboard = await store.getContractorDailyDashboard({ campaignId:'test', actorEmail:'sierra@example.com' });
    assert.equal(dashboard.stats.calls_today, report.totals.calls);
    assert.equal(dashboard.stats.appointments_today, report.totals.appointments);
    await db.query("UPDATE lead_activities SET created_at = '2026-01-02T07:30:00Z' WHERE activity_type = 'call'");
    const pacificDay = await store.getContractorCallReport({ campaignIds:['test'], from:'2026-01-01', to:'2026-01-01' });
    assert.equal(pacificDay.totals.calls, 2, 'reports use Pacific day boundaries rather than UTC midnight');
    await db.query("UPDATE lead_activities SET created_at = CASE WHEN id = $1 THEN '2026-11-01T07:30:00Z'::timestamptz ELSE '2026-11-08T08:00:00Z'::timestamptz END WHERE activity_type = 'call'", [call.activity.id]);
    const weekly = await store.getContractorCallReport({ campaignIds:['test'], from:'2026-11-02', to:'2026-11-08' });
    assert.equal(weekly.totals.calls, 1, 'only calls inside the Monday–Sunday range are counted');
    const previousWeek = await store.getContractorCallReport({ campaignIds:['test'], from:'2026-10-26', to:'2026-11-01' });
    assert.equal(previousWeek.totals.calls, 1, 'Pacific midnight before the DST change stays in the previous week');
    const monthly = await store.getContractorCallReport({ campaignIds:['test'], from:'2026-11-01', to:'2026-11-30' });
    assert.equal(monthly.contractors.find((row) => row.email === 'sierra@example.com').calls, 2);
    assert.equal(monthly.contractors.find((row) => row.email === 'jeremy@example.com').calls, 0);
    assert.equal((await store.getContractorCallReport({ campaignIds:['other'], from:'2026-11-01', to:'2026-11-30' })).totals.calls, 0);
    await store.recordLeadActivity({ leadId:'b', actorEmail:'jeremy@example.com', actorRole:'contractor', activityType:'call', note:'Another caller must not move Sierra’s place' });
    assert.equal((await store.listQueueResumePositions(['test'], 'sierra@example.com'))[0].lead_id, 'a');
    assert.equal((await store.listQueueResumePositions(['test'], 'jeremy@example.com'))[0].lead_id, 'b');
    assert.deepEqual(await store.listQueueResumePositions(['other'], 'sierra@example.com'), []);
  } finally {
    store.setOperationsDatabaseForTests(null);
    await db.close();
  }
});

test('queue advancement and appointment lanes keep prospecting separate from bookings', () => {
  const queue = [{id:'a'}, {id:'b'}, {id:'c'}];
  assert.equal(nextQueueLead(queue, 'a').id, 'b');
  assert.equal(nextQueueLead(queue, 'c').id, 'a');
  assert.equal(nextQueueLead([{id:'a'}], 'a'), null);
  assert.equal(hasBookedAppointment({ stage:'Appointment Set' }), false);
  assert.equal(hasBookedAppointment({ booked_appointment_count:1 }), true);
  assert.equal(salesPipelineLane({ stage:'Qualified', booked_appointment_count:1 }), 'appointments');
  assert.equal(salesPipelineLane({ stage:'Contacted', next_follow_up_at:'2030-01-01' }), 'followups');
  for (const stage of ['Won','Lost','Do Not Call','Appointment Set','Pitched']) assert.equal(belongsInCallQueue({stage}), false);
});
