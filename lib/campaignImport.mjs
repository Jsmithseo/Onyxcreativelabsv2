import { createHash } from 'node:crypto';
import { normaliseContractorImportRow } from './contractorLeadImport.mjs';

export function prepareCampaignImport(batch) {
  const campaign = batch?.campaign || {};
  const source = batch?.source === 'Google Maps' ? 'Google Maps' : 'Apollo';
  const ownerEmail = String(batch?.ownerEmail || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{1,80}$/.test(campaign.id || '') || !String(campaign.name || '').trim()) {
    throw new Error('A campaign ID and name are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) throw new Error('A valid contractor email is required.');
  const candidates = Array.isArray(batch.leads) ? batch.leads : [];
  const expectedCount = Number(batch.expectedCount);
  if (!Number.isInteger(expectedCount) || expectedCount < 1 || expectedCount > 500 || candidates.length !== expectedCount) {
    throw new Error('The input must contain the exact expected number of leads (1–500).');
  }
  const seen = new Set();
  const leads = candidates.map((candidate, index) => {
    const reviewCount = candidate.googleReviewCount;
    const sourceId = String(candidate.sourceId || '').trim();
    const googleUrl = new URL(candidate.googleMapsUrl || 'https://invalid.local');
    const verifiedAt = new Date(candidate.verifiedAt || '');
    if (!Number.isInteger(reviewCount) || reviewCount < 0 || reviewCount > 50 ||
        !/(^|\.)google\.com$/.test(googleUrl.hostname) || !googleUrl.pathname.startsWith('/maps') ||
        !sourceId || Number.isNaN(verifiedAt.valueOf())) {
      throw new Error(`Lead ${index + 1} needs a verified Google listing, count of 0–50, source identity, and verification date.`);
    }
    const location = String(candidate.location || '');
    if (!/\b(?:CA|California)\b/i.test(location) || !candidate.company || !candidate.phone || !candidate.industry || !candidate.website) {
      throw new Error(`Lead ${index + 1} is missing required business information.`);
    }
    if (!String(candidate.callScript || '').trim()) throw new Error(`Lead ${index + 1} is missing a call script.`);
    const businessKey = `${candidate.company}|${location}`.toLowerCase().replace(/[^a-z0-9|]/g, '');
    const digits = String(candidate.phone).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    for (const key of [businessKey, `phone:${digits}`, `source:${sourceId}`]) {
      if (seen.has(key)) throw new Error(`Lead ${index + 1} duplicates another business in this batch.`);
      seen.add(key);
    }
    const notes = [
      candidate.notes || '',
      `Website: ${candidate.website}`,
      `Google reviews: ${reviewCount}`,
      `Google listing: ${googleUrl.href}`,
      `Verified: ${verifiedAt.toISOString()}`,
      candidate.rating !== undefined && candidate.rating !== '' ? `Google rating: ${candidate.rating}` : '',
      `Call script:\n${candidate.callScript}`,
    ].filter(Boolean).join('\n');
    const lead = normaliseContractorImportRow({ ...candidate, zone:'PT', notes });
    if (lead.errors.length || digits.length !== 10) throw new Error(`Lead ${index + 1} has invalid contact information.`);
    const sourceKey = `${source === 'Google Maps' ? 'google-maps' : 'apollo'}:${campaign.id}:${sourceId}`;
    return {
      id:`lead_${createHash('sha256').update(sourceKey).digest('hex').slice(0,24)}`,
      source_key:sourceKey, campaign_id:campaign.id, name:lead.name,
      company:lead.company, title:lead.title, phone:lead.phone, email:lead.email,
      linkedin_url:lead.linkedin, location:lead.location, time_zone:'PT',
      source:`${source} · Onyx Review Bay Area research`, notes:lead.notes,
      follow_up_owner_email:ownerEmail,
    };
  });
  return {
    campaign:{ id:campaign.id, name:String(campaign.name).trim().slice(0,160), description:String(campaign.description || '').slice(0,1000) },
    ownerEmail, leads, expectedCount,
  };
}
