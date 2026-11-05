import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareCampaignImport } from '../lib/campaignImport.mjs';

function batch() {
  return {
    campaign:{ id:'onyx-review-bay-area-1', name:'Onyx Review Bay_area_1' },
    ownerEmail:'robinsonsierra510@gmail.com', expectedCount:1,
    leads:[{ sourceId:'apollo-example', name:'Example business', company:'Example business',
      phone:'(415) 555-0123', email:'', location:'San Francisco, CA', industry:'Plumbing',
      website:'https://example.com', googleReviewCount:50,
      googleMapsUrl:'https://www.google.com/maps/place/example', verifiedAt:'2026-11-05T16:00:00Z',
      callScript:'Hello, may I speak with the owner about customer reviews?' }],
  };
}

test('source identity is stable and the full briefing, script, owner and Pacific zone survive preparation', () => {
  const first = prepareCampaignImport(batch());
  const second = prepareCampaignImport(batch());
  assert.equal(first.leads[0].id, second.leads[0].id);
  assert.equal(first.leads[0].follow_up_owner_email, 'robinsonsierra510@gmail.com');
  assert.equal(first.leads[0].time_zone, 'PT');
  assert.match(first.leads[0].notes, /Google reviews: 50/);
  assert.match(first.leads[0].notes, /Call script:/);
  assert.match(first.leads[0].notes, /Industry: Plumbing/);
});

test('unverified counts, non-Google review sources and duplicate businesses block the batch', () => {
  for (const value of [51, null, '12']) {
    const input = batch(); input.leads[0].googleReviewCount = value;
    assert.throws(() => prepareCampaignImport(input), /verified Google/);
  }
  const wrongSource = batch(); wrongSource.leads[0].googleMapsUrl = 'https://yelp.com/maps/example';
  assert.throws(() => prepareCampaignImport(wrongSource), /verified Google/);
  const duplicate = batch(); duplicate.expectedCount = 2; duplicate.leads.push({ ...duplicate.leads[0] });
  assert.throws(() => prepareCampaignImport(duplicate), /duplicates/);
});
