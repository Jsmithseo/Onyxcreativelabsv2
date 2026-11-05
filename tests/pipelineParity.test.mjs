import test from 'node:test';
import assert from 'node:assert/strict';
import { SALES_PIPELINE_LANES, selectPipelineLeads, salesPipelineLane } from '../lib/salesPipeline.mjs';

test('BDR pipeline defaults to all accessible booked appointments and shares the Admin lane definitions', () => {
 const accessible=[{id:'school-booking',campaign_id:'school',pipeline_eligible:true,stage:'Appointment Set'},{id:'reviews-booking',campaign_id:'reviews',booked_appointment_count:1,stage:'Pitched'},{id:'uncalled',campaign_id:'reviews',stage:'New'}];
 assert.deepEqual(selectPipelineLeads(accessible).map(lead=>lead.id),['school-booking','reviews-booking']);
 assert.deepEqual(selectPipelineLeads(accessible,'reviews').map(lead=>lead.id),['reviews-booking']);
 assert.equal(salesPipelineLane(accessible[1]),'pitched');
 assert.deepEqual(SALES_PIPELINE_LANES.map(([,label])=>label),['Booked appointments','Follow-ups','Pitched','Won','Lost']);
});
