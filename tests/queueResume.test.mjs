import test from 'node:test';
import assert from 'node:assert/strict';
import { belongsInCallQueue, compareCallQueueLeads, resumeCallQueue, nextQueueLead, isDue } from '../lib/callQueue.mjs';

test('queue follow-up indicators support the renderer calling without an explicit clock', () => {
  assert.equal(isDue({ next_follow_up_at: '2000-01-01T00:00:00Z' }), true);
  assert.equal(isDue({ next_follow_up_at: '2100-01-01T00:00:00Z' }), false);
  assert.equal(isDue({}), false);
  assert.equal(isDue({ next_follow_up_at: 'invalid' }), false);
  const deadline = '2026-11-06T20:00:00Z';
  assert.equal(isDue({ next_follow_up_at: deadline }, Date.parse(deadline)), true);
  assert.equal(isDue({ next_follow_up_at: deadline }, Date.parse(deadline) - 1), false);
});

test('a fresh queue resumes after the last saved call and keeps earlier skipped leads', () => {
  const zones = ['PT','MT','CT','ET'];
  const a = {id:'a',name:'Advanced Painting',time_zone:'PT',stage:'New'};
  const b = {id:'b',name:'Best Deal Painting',time_zone:'PT',stage:'Contacted',last_call_at:'2026-11-06T02:55:00Z'};
  const c = {id:'c',name:'Beyond Painting',time_zone:'PT',stage:'New'};
  const d = {id:'d',name:'Delta Painting',time_zone:'PT',stage:'New'};
  const fresh = JSON.parse(JSON.stringify([d,b,c,a]));
  const ordered = fresh.filter(lead=>belongsInCallQueue(lead)).sort((l,r)=>compareCallQueueLeads(l,r,zones));
  const queue = resumeCallQueue(ordered, b, zones);
  assert.deepEqual(queue.map(lead=>lead.id), ['c','d','a']);
  assert.equal(nextQueueLead(queue,'c').id,'d');
  assert.equal(queue.some(lead=>lead.id==='b'),false,'completed calls stay in history instead of re-entering the queue');
  assert.deepEqual(resumeCallQueue(ordered,null,zones).map(lead=>lead.id),['a','c','d']);
  assert.deepEqual(resumeCallQueue(ordered,d,zones).map(lead=>lead.id),['a','c','d'],'the queue wraps when the end is reached');
});

test('due callbacks keep priority when resuming prospecting', () => {
  const now = Date.parse('2026-11-06T20:00:00Z');
  const zones = ['PT','MT','CT','ET'];
  const done = {id:'b',name:'Best Deal',time_zone:'PT'};
  const leads = [{id:'a',name:'Advanced',time_zone:'PT'}, {id:'c',name:'Beyond',time_zone:'PT'}, {id:'z',name:'Callback',time_zone:'PT',last_call_at:'2026-11-05T20:00:00Z',next_follow_up_at:'2026-11-06T19:00:00Z'}];
  const ordered = leads.filter(lead=>belongsInCallQueue(lead,now)).sort((l,r)=>compareCallQueueLeads(l,r,zones,now));
  assert.deepEqual(resumeCallQueue(ordered,done,zones,now).map(lead=>lead.id),['z','c','a']);
});
