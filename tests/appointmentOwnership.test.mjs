import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { appointmentOwnershipStatements } from '../lib/appointmentOwnership.mjs';
import { belongsInCallQueue } from '../lib/callQueue.mjs';

const source = (await readFile(new URL('../lib/operationsStore.js', import.meta.url), 'utf8'))
  .replace("import { neon } from '@neondatabase/serverless';", "const neon=()=>{throw new Error('Isolated database required');};")
  .replace("import { listContractors } from './contractorStore';", 'const listContractors=async()=>[];')
  .replace(/from '(\.\/[^']+\.mjs)'/g, (_, path) => `from '${new URL('../lib/'+path.slice(2), import.meta.url).href}'`);
const store = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));

async function fixture() {
  const db = new PGlite();
  const migration = await readFile(new URL('../scripts/migrate-shared-operations.mjs', import.meta.url), 'utf8');
  const schema = migration.slice(migration.indexOf('const statements = ['), migration.indexOf('for (const statement'));
  const { statements } = await import('data:text/javascript;base64,'+Buffer.from(schema+'\nexport {statements};').toString('base64'));
  for (const statement of statements) await db.exec(statement);
  await db.query("INSERT INTO campaigns(id,name) VALUES ('test','Test'), ('other','Other')");
  await db.query("INSERT INTO leads(id,campaign_id,source_key,name,follow_up_owner_email) VALUES ('a','test','a','Shared A','sierra@example.com'), ('b','test','b','Shared B','sierra@example.com'), ('c','other','c','Other campaign lead','jeremy@example.com')");
  store.setOperationsDatabaseForTests(db);
  return db;
}

test('a shared prospect becomes private to its booking contractor and Admin across every read and write', async () => {
  const db = await fixture();
  const sierra = 'sierra@example.com', jeremy = 'jeremy@example.com';
  const activity = (email, type, extra = {}) => store.recordLeadActivity({ leadId:'a', actorEmail:email, actorRole:'contractor', activityType:type, ...extra });
  try {
    await activity(sierra, 'call', { note:'Sierra called first' });
    const sierraLead = (await store.listPipeline(['test'], sierra)).find(lead => lead.id === 'a');
    const jeremyLead = (await store.listPipeline(['test'], jeremy)).find(lead => lead.id === 'a');
    assert.equal(belongsInCallQueue(sierraLead), false);
    assert.equal(belongsInCallQueue(jeremyLead), true, 'another contractor can still work an unbooked shared lead');
    await activity(jeremy, 'call', { note:'Jeremy called next' });
    assert.equal((await store.listCallHistory({ campaignIds:['test'], viewerEmail:sierra })).total, 2);
    assert.equal((await store.listCallHistory({ campaignIds:['test'], viewerEmail:jeremy })).total, 2);
    assert.equal((await store.getLeadDetail('a', ['test'], sierra)).activities.length, 2);
    await activity(jeremy, 'appointment', { note:'Calendly confirmed', scheduledFor:new Date(Date.now()+86400000).toISOString() });
    const owned = await store.getLeadDetail('a', ['test'], jeremy);
    assert.equal(owned.lead.booked_by_email, jeremy, 'the booking actor owns it, rather than the original follow-up assignee');
    assert.ok(owned.lead.booked_at);
    assert.equal(owned.lead.stage, 'Appointment Set');
    assert.equal(await store.getLeadDetail('a', ['test'], sierra), null);
    assert.ok(await store.getLeadDetail('a', ['test']), 'Admin retains access');
    assert.equal((await store.listPipeline(['test'], sierra)).some(lead => lead.id === 'a'), false);
    const pipeline = await store.listPipeline(['test'], jeremy);
    assert.equal(pipeline.find(lead => lead.id === 'a').pipeline_eligible, true);
    assert.equal(belongsInCallQueue(pipeline.find(lead => lead.id === 'a')), false);
    assert.equal((await store.listCallHistory({ campaignIds:['test'], viewerEmail:sierra })).total, 0);
    assert.equal((await store.listCallHistory({ campaignIds:['test'], viewerEmail:jeremy })).total, 2);
    assert.equal((await store.listCallHistory({ campaignIds:['test'] })).total, 2);
    assert.equal((await store.listAppointments(['test'], sierra)).length, 0);
    assert.equal((await store.listAppointments(['test'], jeremy)).length, 1);
    assert.equal((await store.listAppointments(['test'])).length, 1);
    const dashboard = await store.getContractorDailyDashboard({ campaignId:'test', actorEmail:sierra });
    assert.equal(dashboard.stats.calls_today, 1, 'completed work remains in personal totals');
    assert.equal(dashboard.calls.length, 0, 'private lead details do not leak through the personal dashboard');
    for (const type of ['call','note','appointment']) await assert.rejects(activity(sierra, type, { note:'Calendly confirmed' }), /no longer available/);
    await assert.rejects(activity(jeremy, 'call'), /no longer available/, 'Admin now conducts the meeting');
    await assert.rejects(activity(jeremy, 'stage_change', { nextStage:'Pitched' }), /Admin manages/);
    await store.recordLeadActivity({ leadId:'a', actorEmail:'admin@example.com', actorRole:'admin', activityType:'stage_change', nextStage:'Pitched' });
    assert.equal((await store.getLeadDetail('a', ['test'], jeremy)).lead.stage, 'Pitched');
    assert.equal(await store.getLeadDetail('a', ['test'], sierra), null, 'moving a sales stage cannot release privacy');
    assert.equal(await store.getLeadDetail('c', ['test'], jeremy), null, 'booking ownership never grants access to unrelated campaign leads');
    assert.ok(await store.getLeadDetail('a', [], jeremy), 'the booker retains their own opportunity after campaign assignments change');
    assert.deepEqual((await store.listPipeline([], jeremy)).map(lead => lead.id), ['a']);
    assert.equal((await store.listAppointments([], jeremy)).length, 1);
    assert.equal(await store.getLeadDetail('a', [], sierra), null);
    const competing = await Promise.allSettled([sierra,jeremy].map(email => store.recordLeadActivity({ leadId:'b', actorEmail:email, actorRole:'contractor', activityType:'appointment', note:'Calendly confirmed' })));
    assert.equal(competing.filter(result => result.status === 'fulfilled').length, 1);
    assert.equal((await db.query("SELECT COUNT(*)::int AS count FROM lead_activities WHERE lead_id='b' AND activity_type='appointment'")).rows[0].count, 1);
  } finally { store.setOperationsDatabaseForTests(null); await db.close(); }
});

test('migration recovers the original booking owner, protects unknown legacy owners, and is idempotent', async () => {
  const db = await fixture();
  try {
    await db.query("INSERT INTO lead_activities(id,lead_id,campaign_id,actor_email,actor_role,activity_type,note,created_at) VALUES ('first','a','test','Jeremy@Example.com','contractor','appointment','Calendly confirmed','2026-11-01'), ('later','a','test','admin@example.com','admin','appointment','Calendly rescheduled','2026-11-02')");
    await db.query("UPDATE leads SET stage='Appointment Set' WHERE id IN ('a','b')");
    for (const statement of appointmentOwnershipStatements) await db.exec(statement);
    const before = (await db.query('SELECT id, booked_by_email, booked_at FROM leads ORDER BY id')).rows;
    assert.equal(before[0].booked_by_email, 'jeremy@example.com');
    assert.ok(before[1].booked_at);
    assert.equal(before[1].booked_by_email, null, 'unknown owners remain Admin-only');
    assert.equal(await store.getLeadDetail('b', ['test'], 'sierra@example.com'), null);
    for (const statement of appointmentOwnershipStatements) await db.exec(statement);
    assert.deepEqual((await db.query('SELECT id, booked_by_email, booked_at FROM leads ORDER BY id')).rows, before);
  } finally { store.setOperationsDatabaseForTests(null); await db.close(); }
});
