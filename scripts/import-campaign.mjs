// Run with the linked project's production environment. Default mode validates
// the batch and reads current records; --apply is the only mode that writes.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { get, put } from '@vercel/blob';
import { prepareCampaignImport } from '../lib/campaignImport.mjs';

const inputPath = process.argv.find((arg) => arg.startsWith('--file='))?.slice(7);
if (!inputPath) throw new Error('Pass --file=/absolute/path/to/reviewed-batch.json. Default mode is read-only.');
const batch = prepareCampaignImport(JSON.parse(await readFile(inputPath, 'utf8')));
if (!process.env.DATABASE_URL || !process.env.BLOB_READ_WRITE_TOKEN) throw new Error('The linked database and contractor store are required.');
const sql = neon(process.env.DATABASE_URL);
const contractorPath = `contractors/${createHash('sha256').update(batch.ownerEmail).digest('hex')}.json`;

async function readContractor() {
  const result = await get(contractorPath, { access:'private', useCache:false });
  if (result?.statusCode !== 200) throw new Error('The target contractor does not exist.');
  const contractor = JSON.parse(await new Response(result.stream).text());
  if (String(contractor.email || '').toLowerCase() !== batch.ownerEmail) throw new Error('Contractor identity mismatch.');
  return { contractor, etag:result.blob.etag };
}

const { contractor } = await readContractor();
const existingCampaign = await sql.query('SELECT id, name FROM campaigns WHERE id = $1', [batch.campaign.id]);
if (existingCampaign.length && existingCampaign[0].name !== batch.campaign.name) throw new Error('The campaign ID already belongs to a different campaign.');
const sources = batch.leads.map((lead) => lead.source_key);
const phones = batch.leads.map((lead) => lead.phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''));
const emails = batch.leads.map((lead) => lead.email).filter(Boolean);
const existing = await sql.query(`
  SELECT id, source_key, campaign_id, LOWER(email) AS email,
    REGEXP_REPLACE(REGEXP_REPLACE(phone, '\\D', '', 'g'), '^1(?=[0-9]{10}$)', '') AS phone
  FROM leads
  WHERE source_key = ANY($1::text[]) OR LOWER(email) = ANY($2::text[])
     OR REGEXP_REPLACE(REGEXP_REPLACE(phone, '\\D', '', 'g'), '^1(?=[0-9]{10}$)', '') = ANY($3::text[])
`, [sources, emails, phones]);
const conflicts = existing.filter((lead) => !sources.includes(lead.source_key));
if (conflicts.length) throw new Error(`${conflicts.length} existing lead identities conflict with the proposed import; no records changed.`);
const summary = {
  mode:process.argv.includes('--apply') ? 'apply' : 'preview',
  campaign:batch.campaign, contractor:{ email:batch.ownerEmail, name:contractor.name },
  candidates:batch.leads.length, existing:existing.length,
  newLeads:batch.leads.length - existing.length,
  accessAlreadyGranted:Array.isArray(contractor.campaigns) && contractor.campaigns.includes(batch.campaign.id),
};
console.log(JSON.stringify(summary));

if (process.argv.includes('--apply')) {
  await sql.transaction([
    sql.query(`INSERT INTO campaigns (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
      [batch.campaign.id, batch.campaign.name, batch.campaign.description]),
    sql.query(`
      INSERT INTO leads (id, source_key, campaign_id, name, company, title, phone, email,
        linkedin_url, location, time_zone, source, notes, follow_up_owner_email)
      SELECT incoming.id, incoming.source_key, incoming.campaign_id, incoming.name,
        incoming.company, incoming.title, incoming.phone, incoming.email, incoming.linkedin_url,
        incoming.location, incoming.time_zone, incoming.source, incoming.notes, incoming.follow_up_owner_email
      FROM jsonb_to_recordset($1::jsonb) AS incoming(
        id TEXT, source_key TEXT, campaign_id TEXT, name TEXT, company TEXT, title TEXT,
        phone TEXT, email TEXT, linkedin_url TEXT, location TEXT, time_zone TEXT, source TEXT,
        notes TEXT, follow_up_owner_email TEXT)
      ON CONFLICT (source_key) DO NOTHING
    `, [JSON.stringify(batch.leads)]),
  ]);
  // Read afresh and require the same ETag when appending access. Other Admin
  // changes to Sierra's record cannot be silently overwritten.
  const fresh = await readContractor();
  if (!fresh.contractor.campaigns?.includes(batch.campaign.id)) {
    await put(contractorPath, JSON.stringify({
      ...fresh.contractor,
      campaigns:[...new Set([...(fresh.contractor.campaigns || []), batch.campaign.id])],
    }), { access:'private', addRandomSuffix:false, allowOverwrite:true, ifMatch:fresh.etag,
      cacheControlMaxAge:60, contentType:'application/json' });
  }
  const verified = await sql.query(`
    SELECT COUNT(*)::int AS leads, COUNT(*) FILTER (WHERE follow_up_owner_email = $2)::int AS assigned
    FROM leads WHERE campaign_id = $1 AND source_key = ANY($3::text[])
  `, [batch.campaign.id, batch.ownerEmail, sources]);
  const access = await readContractor();
  if (verified[0]?.leads !== batch.expectedCount || verified[0]?.assigned !== batch.expectedCount || !access.contractor.campaigns?.includes(batch.campaign.id)) {
    throw new Error('Import verification did not match the requested count and access; inspect before retrying.');
  }
  console.log(JSON.stringify({ verified:true, campaignId:batch.campaign.id, ownerEmail:batch.ownerEmail,
    leads:verified[0].leads, assigned:verified[0].assigned, campaignAccess:true }));
}
