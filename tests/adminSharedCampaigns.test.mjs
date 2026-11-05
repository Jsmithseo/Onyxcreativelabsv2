import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/dialer/admin/app.js', import.meta.url), 'utf8');
const mergeSource = source.slice(source.indexOf('function mergeSharedCampaigns()'), source.indexOf('const sharedPipelineColumns'));

test('a new shared campaign and its lead become available in Admin without copying or re-importing the record', () => {
  const selects = Object.fromEntries(['campaignSelect','settingsGoalCampaign','commissionCampaign','sharedCallsCampaign'].map((id) => [id, { options:[], append(option) { this.options.push(option); } }]));
  const localLead = { id:7, name:'Old name', campaign:'school', phone:'4155550100', notes:'Old notes' };
  const newLead = { id:'lead_new', name:'New business', campaign_id:'new-campaign', company:'New business', phone:'4155550101', notes:'Call script:\nA script', stage:'New', follow_up_owner_email:'sierra@example.com', time_zone:'PT' };
  const context = {
    campaigns:[{ id:'school', name:'School' }], leads:[localLead], activeCallLeadId:null, selectedIndex:-1,
    sharedWorkspace:{ campaigns:[{ id:'school', name:'School', is_active:true }, { id:'new-campaign', name:'Bay Area campaign', is_active:true }],
      leads:[{ id:'lead_existing', campaign_id:'school', name:'Updated name', phone:'4155550100', stage:'Contacted', notes:'Shared note' },newLead],
      campaignSummaries:[{ campaign_id:'new-campaign', call_count:3, appointment_count:1, won_count:0 }] },
    savedLeadIdentity:(lead) => lead.phone ? [`phone:${lead.phone}`] : [],
    document:{ getElementById:(id) => selects[id] || { classList:{ contains:() => false } }, createElement:() => ({}) },
    renderCampaigns() {}, renderRows() {}, renderContractors() {},
  };
  vm.runInNewContext(`${mergeSource}\nthis.merge = mergeSharedCampaigns;`, context);
  context.merge();
  assert.equal(context.leads.length, 2);
  assert.equal(localLead.id, 7);
  assert.equal(localLead.sharedLeadId, 'lead_existing');
  assert.equal(localLead.notes, 'Shared note');
  const imported = context.leads.find((lead) => lead.sharedLeadId === 'lead_new');
  assert.equal(imported.assignedTo, 'sierra@example.com');
  assert.match(imported.notes, /Call script/);
  assert.equal(context.campaigns.find((campaign) => campaign.id === 'new-campaign').calls, 3);
  assert.equal(selects.campaignSelect.options.find((option) => option.value === 'new-campaign').textContent, 'Bay Area campaign');
  context.merge();
  assert.equal(context.leads.length, 2);
  assert.equal(selects.campaignSelect.options.length, 2);
  context.selectedIndex = imported.id;
  context.document.getElementById = (id) => selects[id] || { classList:{ contains:() => true } };
  imported.notes = 'Unsaved draft';
  context.merge();
  assert.equal(imported.notes, 'Unsaved draft');
});

test('after master sync Admin reads only shared records and shared campaign totals', () => {
  const selects=Object.fromEntries(['campaignSelect','settingsGoalCampaign','commissionCampaign','sharedCallsCampaign'].map(id=>[id,{options:[],append(option){this.options.push(option);}}]));
  const context={campaigns:[{id:'school',name:'School'},{id:'stale',name:'Browser-only campaign'}],leads:[{id:1,campaign:'school',phone:'4155550100',name:'Cached name'},{id:2,campaign:'stale',phone:'4155550101',name:'Browser-only lead'}],activeCallLeadId:null,selectedIndex:-1,
    sharedWorkspace:{adminMasterSynced:true,campaigns:[{id:'school',name:'School'}],leads:[{id:'shared',campaign_id:'school',phone:'4155550100',name:'Shared name',stage:'Contacted',notes:'Shared notes'}],campaignSummaries:[{campaign_id:'school',call_count:7,appointment_count:1}]},
    savedLeadIdentity:lead=>lead.phone?[`phone:${lead.phone}`]:[],document:{getElementById:id=>selects[id]||{classList:{contains:()=>false}},createElement:()=>({})},renderCampaigns(){},renderRows(){},renderContractors(){}};
  vm.runInNewContext(mergeSource+'\nthis.merge=mergeSharedCampaigns;',context);
  context.merge();
  assert.equal(context.leads.length,1);
  assert.equal(context.leads[0].sharedLeadId,'shared');
  assert.equal(context.leads[0].name,'Shared name');
  assert.equal(context.campaigns.length,1);
  assert.equal(context.campaigns[0].calls,7);
  context.sharedWorkspace.leads=[];
  context.merge();
  assert.equal(context.leads.length,0,'removed server records must not reappear from browser data');
});
