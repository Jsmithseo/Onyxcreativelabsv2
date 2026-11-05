import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../public/dialer/admin/app.js', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('function reportDateRange('), source.indexOf('function renderSharedCallHistory('));

test('calendar reporting periods handle Monday weeks, leap years and year boundaries', () => {
  const context = {};
  vm.runInNewContext(`${helpers}\nthis.range = reportDateRange;`, context);
  for (const [date, period, from, to] of [
    ['2026-11-05','day','2026-11-05','2026-11-05'],
    ['2026-11-05','week','2026-11-02','2026-11-08'],
    ['2026-11-01','week','2026-10-26','2026-11-01'],
    ['2026-01-01','week','2025-12-29','2026-01-04'],
    ['2026-11-30','month','2026-11-01','2026-11-30'],
    ['2026-12-31','month','2026-12-01','2026-12-31'],
    ['2024-02-29','month','2024-02-01','2024-02-29'],
    ['2026-02-01','month','2026-02-01','2026-02-28'],
  ]) assert.deepEqual(JSON.parse(JSON.stringify(context.range(date,period))), {from,to});
  for (const invalid of ['', '2026-02-30','not a date']) assert.throws(() => context.range(invalid));
});

test('weekly/monthly report requests keep call history on its explicit campaign filter', async () => {
  const controls = new Map();
  const control = (id) => {
    if (!controls.has(id)) controls.set(id,{value:'',textContent:'',innerHTML:''});
    return controls.get(id);
  };
  control('statsDate').value = '2026-11-05';
  control('statsPeriod').value = 'week';
  control('campaignSelect').value = 'school';
  const urls = [];
  const context = {
    document:{getElementById:control}, URLSearchParams,
    statsMode:'campaign', campaigns:[{id:'school',name:'School'},{id:'bay',name:'Bay Area'}],
    contractorActivityRequest:0, contractorReport:null, sharedCallPage:0, sharedCallPageSize:20,
    renderSharedCallHistory() {}, updateMetrics() {}, renderGoals() {},
    fetch:async (url) => { urls.push(new URL(url,'https://test.example')); return { ok:true, json:async () => url.includes('call-report') ? { contractors:[], totals:{} } : {calls:[],total:0} }; },
  };
  const refresh = source.slice(source.indexOf('async function refreshContractorActivity('), source.indexOf('let selectedSharedLeadId'));
  vm.runInNewContext(`${helpers}\n${refresh}\nthis.refresh = refreshContractorActivity;`, context);
  await context.refresh();
  assert.equal(urls[0].searchParams.get('from'),'2026-11-02');
  assert.equal(urls[0].searchParams.get('to'),'2026-11-08');
  assert.equal(urls[0].searchParams.get('campaign'),'school');
  assert.equal(urls[1].searchParams.has('campaign'),false,'selected stats campaign must not silently hide other BDR calls');
  control('statsPeriod').value = 'month';
  control('sharedCallsCampaign').value = 'bay';
  await context.refresh();
  assert.equal(urls[2].searchParams.get('from'),'2026-11-01');
  assert.equal(urls[2].searchParams.get('to'),'2026-11-30');
  assert.equal(urls[3].searchParams.get('campaign'),'bay');
});
