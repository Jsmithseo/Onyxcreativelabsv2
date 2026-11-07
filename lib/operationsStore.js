import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { listContractors } from './contractorStore';
import { invalidLegacyAssignments, legacyAssignment } from './legacyAssignment.mjs';
import { importIdentity, normaliseContractorImportRow } from './contractorLeadImport.mjs';
import { hasBookedAppointment, salesPipelineLane } from './salesPipeline.mjs';

export const LEAD_STAGES = [
  'New',
  'Contacted',
  'Qualified',
  'Appointment Set',
  'Pitched',
  'Won',
  'Lost',
  'Do Not Call',
];

const WORKABLE_STAGES = new Set(
  LEAD_STAGES.filter((stage) => !['Won', 'Lost'].includes(stage))
);
const ACTIVITY_TYPES = new Set(['call', 'note', 'appointment', 'stage_change']);

let client;

// Used only by the isolated database harness. Runtime callers always use the
// configured Neon client above; no API route can set this value.
export function setOperationsDatabaseForTests(testDatabase) {
  client = testDatabase || null;
}

function database() {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Shared operations database is not configured.');
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

function resultRows(result) {
  return Array.isArray(result) ? result : result?.rows || [];
}

// Empty viewer is reserved for server-authorized Admin operations. An assigned
// contractor shares unbooked leads and can see only their own booked leads.
function leadVisibilitySql(alias, viewer) {
  return `(${viewer} = '' OR ${alias}.booked_at IS NULL OR ${alias}.booked_by_email = ${viewer})`;
}

function cleanText(value, maxLength = 4000) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function cleanStage(value, fallback = 'New') {
  const stage = cleanText(value, 80);
  return LEAD_STAGES.includes(stage) ? stage : fallback;
}

function cleanCents(value) {
  if (value === null || value === undefined || value === '') return null;
  const cents = Number(value);
  return Number.isInteger(cents) && cents >= 0 ? cents : null;
}

function cleanDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

function normalisedPhone(value) {
  return cleanText(value, 64).replace(/\D/g, '');
}

function usableEmail(value) {
  const email = cleanText(value, 320).toLowerCase();
  return email && email !== '—' ? email : '';
}

function usablePhone(value) {
  const phone = normalisedPhone(value);
  return phone.length >= 7 ? phone : '';
}

function legacyLeadIdentity(lead) {
  const email = usableEmail(lead.email);
  const phone = normalisedPhone(lead.phone);
  return [
    cleanText(lead.campaignId || lead.campaign, 80),
    cleanText(lead.source, 160),
    email || phone || cleanText(lead.name, 240),
    cleanText(lead.company, 240),
  ]
    .join('|')
    .toLowerCase();
}

function stableLeadId(identity) {
  return `lead_${crypto.createHash('sha256').update(identity).digest('hex').slice(0, 24)}`;
}

function normaliseLegacyLead(lead) {
  const campaignId = cleanText(lead.campaignId || lead.campaign, 80);
  const identity = legacyLeadIdentity({ ...lead, campaignId });
  const sourceKey = `legacy:${crypto
    .createHash('sha256')
    .update(identity)
    .digest('hex')}`;
  const assignment = legacyAssignment(lead);

  return {
    id: stableLeadId(sourceKey),
    campaign_id: campaignId,
    source_key: sourceKey,
    name: cleanText(lead.name, 240) || 'Unnamed lead',
    company: cleanText(lead.company, 240),
    title: cleanText(lead.title, 240),
    phone: cleanText(lead.phone, 80),
    email: cleanText(lead.email, 320).toLowerCase(),
    linkedin_url: cleanText(lead.linkedin || lead.linkedinUrl, 2000),
    location: cleanText(lead.location, 320),
    time_zone: cleanText(lead.zone || lead.timeZone, 32),
    source: cleanText(lead.source, 240),
    stage: cleanStage(lead.stage),
    disposition: cleanText(lead.disposition, 240),
    notes: cleanText(lead.notes, 12000),
    next_follow_up_at: cleanDate(lead.followAt || lead.nextFollowUpAt),
    follow_up_owner_email: assignment.email,
    assignment_action: assignment.action,
    potential_commission_cents: cleanCents(lead.potentialCommissionCents),
  };
}

export function campaignIdsFrom(value) {
  const ids = Array.isArray(value) ? value : [];
  return [...new Set(ids.map((id) => cleanText(id, 80)).filter(Boolean))];
}

export async function listCampaigns(campaignIds = null) {
  const sql = database();
  const result = campaignIds?.length
    ? await sql.query(
        `
          SELECT id, name, description, default_commission_cents,
                 is_active, created_at, updated_at
          FROM campaigns
          WHERE id = ANY($1::text[])
          ORDER BY name
        `,
        [campaignIds]
      )
    : await sql.query(`
        SELECT id, name, description, default_commission_cents,
               is_active, created_at, updated_at
        FROM campaigns
        ORDER BY name
      `);
  return resultRows(result);
}

export async function importLegacyWorkspace({ campaigns = [], leads = [] }) {
  const sql = database();
  const campaignRows = (Array.isArray(campaigns) ? campaigns : [])
    .map((campaign) => ({
      id: cleanText(campaign.id, 80),
      name: cleanText(campaign.name, 160),
      description: cleanText(campaign.description, 1000),
    }))
    .filter((campaign) => campaign.id && campaign.name);

  for (const campaign of campaignRows) {
    await sql.query(
      `
        INSERT INTO campaigns (id, name, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            description = CASE
              WHEN EXCLUDED.description = '' THEN campaigns.description
              ELSE EXCLUDED.description
            END,
            updated_at = NOW()
      `,
      [campaign.id, campaign.name, campaign.description]
    );
  }

  const campaignIds = new Set((await listCampaigns()).map((campaign) => campaign.id));
  const leadRows = (Array.isArray(leads) ? leads : [])
    .map(normaliseLegacyLead)
    .filter((lead) => lead.campaign_id && campaignIds.has(lead.campaign_id));

  if (!leadRows.length) return { campaigns: campaignRows.length, leads: 0 };

  const invalidAssignments = invalidLegacyAssignments(
    leadRows,
    await listContractors()
  );
  if (invalidAssignments.length) {
    throw new Error(
      'Reconciliation stopped because one or more assignments lack a contractor with campaign access.'
    );
  }

  const preview = await previewLegacyReconciliation({ leads: leadRows, normalised: true });
  if (preview.identity_conflict_count) {
    throw new Error(
      'Reconciliation stopped because one or more leads match an existing shared lead under a different source or campaign.'
    );
  }

  await sql.query(
    `
      INSERT INTO leads (
        id, campaign_id, source_key, name, company, title, phone, email,
        linkedin_url, location, time_zone, source, stage, disposition, notes,
        next_follow_up_at, follow_up_owner_email, potential_commission_cents
      )
      SELECT
        incoming.id, incoming.campaign_id, incoming.source_key, incoming.name,
        incoming.company, incoming.title, incoming.phone, incoming.email,
        incoming.linkedin_url, incoming.location, incoming.time_zone,
        incoming.source, incoming.stage, incoming.disposition, incoming.notes,
        incoming.next_follow_up_at, incoming.follow_up_owner_email,
        incoming.potential_commission_cents
      FROM jsonb_to_recordset($1::jsonb) AS incoming(
        id TEXT,
        campaign_id TEXT,
        source_key TEXT,
        name TEXT,
        company TEXT,
        title TEXT,
        phone TEXT,
        email TEXT,
        linkedin_url TEXT,
        location TEXT,
        time_zone TEXT,
        source TEXT,
        stage TEXT,
        disposition TEXT,
        notes TEXT,
        next_follow_up_at TIMESTAMPTZ,
        follow_up_owner_email TEXT,
        potential_commission_cents INTEGER
      )
      ON CONFLICT (source_key) DO UPDATE
      SET name = EXCLUDED.name,
          company = EXCLUDED.company,
          title = EXCLUDED.title,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          linkedin_url = EXCLUDED.linkedin_url,
          location = EXCLUDED.location,
          time_zone = EXCLUDED.time_zone,
          source = EXCLUDED.source,
          updated_at = NOW()
    `,
    [JSON.stringify(leadRows)]
  );

  // Browser-first legacy queues use `assignedTo`; a non-empty value updates a
  // durable assignee, while omitted or blank values preserve it. Clearing an
  // owner requires the deliberately named clearAssignment flag.
  for (const lead of leadRows.filter((row) => row.assignment_action !== 'none')) {
    await sql.query(
      `
        UPDATE leads
        SET follow_up_owner_email = $2, updated_at = NOW()
        WHERE source_key = $1
      `,
      [lead.source_key, lead.follow_up_owner_email]
    );
  }

  return { campaigns: campaignRows.length, leads: leadRows.length };
}

export async function previewLegacyReconciliation({ leads = [], normalised = false }) {
  const leadRows = (Array.isArray(leads) ? leads : [])
    .map((lead) => (normalised ? lead : normaliseLegacyLead(lead)))
    .filter((lead) => lead.campaign_id && lead.source_key);
  if (!leadRows.length) {
    return {
      candidate_count: 0,
      explicit_assignment_count: 0,
      exact_match_count: 0,
      identity_conflict_count: 0,
    };
  }

  const sourceKeys = leadRows.map((lead) => lead.source_key);
  const emails = [...new Set(leadRows.map((lead) => usableEmail(lead.email)).filter(Boolean))];
  const phones = [...new Set(leadRows.map((lead) => usablePhone(lead.phone)).filter(Boolean))];
  const existing = resultRows(await database().query(
    `
      SELECT source_key, campaign_id, LOWER(email) AS email,
             REGEXP_REPLACE(phone, '\\D', '', 'g') AS phone
      FROM leads
      WHERE source_key = ANY($1::text[])
         OR ($2::text[] <> ARRAY[]::text[] AND LOWER(email) = ANY($2::text[]))
         OR ($3::text[] <> ARRAY[]::text[] AND REGEXP_REPLACE(phone, '\\D', '', 'g') = ANY($3::text[]))
    `,
    [sourceKeys, emails, phones]
  ));
  const exactKeys = new Set(existing.map((lead) => lead.source_key));
  const identityConflicts = new Set();
  for (const lead of leadRows) {
    if (exactKeys.has(lead.source_key)) continue;
    const email = usableEmail(lead.email);
    const phone = usablePhone(lead.phone);
    const matching = existing.find((row) =>
      (email && row.email === email) || (phone && row.phone === phone)
    );
    if (matching) identityConflicts.add(lead.source_key);
  }

  return {
    candidate_count: leadRows.length,
    explicit_assignment_count: leadRows.filter((lead) => lead.assignment_action === 'assign').length,
    explicit_clear_count: leadRows.filter((lead) => lead.assignment_action === 'clear').length,
    exact_match_count: leadRows.filter((lead) => exactKeys.has(lead.source_key)).length,
    identity_conflict_count: identityConflicts.size,
  };
}

export async function isAdminMasterSynced() {
  const rows = resultRows(await database().query("SELECT id FROM operations_schema_migrations WHERE id = 'admin-master-queues-v1'"));
  return rows.length > 0;
}

export async function previewAdminCampaignSync({ campaigns = [], leads = [] }) {
  const rows = leads.filter((lead) => !lead.sharedLeadId).map(normaliseLegacyLead);
  const campaignIds = new Set(campaigns.map((campaign) => campaign.id));
  const unknownCount = rows.filter((row) => !campaignIds.has(row.campaign_id)).length;
  const claims = leads.filter((lead) => lead.sharedLeadId);
  const existing = resultRows(await database().query('SELECT id, campaign_id, source_key FROM leads'));
  const invalidClaims = claims.filter((claim) => !existing.some((row) => row.id === claim.sharedLeadId && row.campaign_id === (claim.campaignId || claim.campaign))).length;
  const keys = rows.map((row) => row.source_key);
  const duplicateCount = keys.length - new Set(keys).size;
  const preview = await previewLegacyReconciliation({ leads:rows, normalised:true });
  const invalidCount = invalidLegacyAssignments(rows, await listContractors()).length;
  const legacyCalls = leads.filter((lead) => !lead.sharedLeadId && (lead.called || Number(lead.attempts || 0) > 0 || lead.lastContact)).length;
  const claimIds = new Set(claims.map((lead) => lead.sharedLeadId));
  const sourceKeys = new Set(keys);
  const missingShared = existing.filter((row) => !claimIds.has(row.id) && !sourceKeys.has(row.source_key)).length;
  const totals = campaigns.map((campaign) => {
    const candidates = rows.filter((row) => row.campaign_id === campaign.id);
    return { id:campaign.id, name:campaign.name, shared:existing.filter((row) => row.campaign_id === campaign.id).length, candidates:candidates.length };
  });
  const hash = crypto.createHash('sha256').update(JSON.stringify({ campaigns, leads:rows, shared:claims.map((lead) => [lead.sharedLeadId,lead.campaignId || lead.campaign]) })).digest('hex');
  return { ...preview, duplicate_count:duplicateCount, invalid_assignment_count:invalidCount,
    invalid_shared_count:invalidClaims, missing_shared_count:missingShared, unknown_campaign_count:unknownCount, legacy_call_state_count:legacyCalls,
    ready:!duplicateCount && !invalidCount && !invalidClaims && !missingShared && !unknownCount && !legacyCalls && !preview.identity_conflict_count,
    preview_hash:hash, campaigns:totals };
}

export async function syncAdminCampaigns(snapshot, expectedHash) {
  const preview = await previewAdminCampaignSync(snapshot);
  if (!preview.ready || preview.preview_hash !== expectedHash) throw new Error('Preview the current Admin queues and resolve conflicts before syncing.');
  const result = await importLegacyWorkspace({ ...snapshot, leads:snapshot.leads.filter((lead) => !lead.sharedLeadId) });
  await database().query("INSERT INTO operations_schema_migrations(id) VALUES ('admin-master-queues-v1') ON CONFLICT (id) DO NOTHING");
  return result;
}

// Contractor uploads are deliberately separate from the Admin legacy
// reconciliation path. The caller supplies neither an owner nor a trusted
// source key: both are derived here from the authenticated principal.
export async function importContractorLeads({ campaignId, ownerEmail, leads = [] }) {
  const campaign = cleanText(campaignId, 80);
  const owner = cleanText(ownerEmail, 320).toLowerCase();
  if (!campaign || !owner) throw new Error('A contractor and campaign are required.');

  const leadRows = (Array.isArray(leads) ? leads : [])
    .map(normaliseContractorImportRow)
    .filter((lead) => !lead.errors.length)
    .map((lead) => {
      const identity = importIdentity({ campaignId: campaign, ownerEmail: owner, lead });
      const sourceKey = `contractor-csv:${crypto.createHash('sha256').update(identity).digest('hex')}`;
      return {
        id: stableLeadId(sourceKey),
        source_key: sourceKey,
        campaign_id: campaign,
        follow_up_owner_email: owner,
        name: lead.name,
        company: lead.company,
        title: lead.title,
        phone: cleanText(lead.phone, 80),
        email: usableEmail(lead.email),
        linkedin_url: cleanText(lead.linkedin, 2000),
        location: lead.location,
        time_zone: lead.zone,
        source: 'Contractor CSV import',
        stage: 'New',
        disposition: '',
        notes: cleanText(lead.notes, 12000),
      };
    });
  if (!leadRows.length) return { imported: 0, skipped: 0, rejected: 0 };

  const sourceKeys = leadRows.map((lead) => lead.source_key);
  const emails = [...new Set(leadRows.map((lead) => usableEmail(lead.email)).filter(Boolean))];
  const phones = [...new Set(leadRows.map((lead) => usablePhone(lead.phone)).filter(Boolean))];
  const existing = resultRows(await database().query(
    `
      SELECT source_key, LOWER(email) AS email,
             REGEXP_REPLACE(phone, '\\D', '', 'g') AS phone
      FROM leads
      WHERE source_key = ANY($1::text[])
         OR ($2::text[] <> ARRAY[]::text[] AND LOWER(email) = ANY($2::text[]))
         OR ($3::text[] <> ARRAY[]::text[] AND REGEXP_REPLACE(phone, '\\D', '', 'g') = ANY($3::text[]))
    `,
    [sourceKeys, emails, phones]
  ));
  const exact = new Set(existing.map((lead) => lead.source_key));
  const conflicts = new Set();
  for (const lead of leadRows) {
    if (exact.has(lead.source_key)) continue;
    const matching = existing.find((row) =>
      (lead.email && row.email === lead.email) ||
      (usablePhone(lead.phone) && row.phone === usablePhone(lead.phone))
    );
    if (matching) conflicts.add(lead.source_key);
  }
  const insertable = leadRows.filter((lead) => !exact.has(lead.source_key) && !conflicts.has(lead.source_key));
  if (!insertable.length) {
    return { imported: 0, skipped: exact.size, rejected: conflicts.size };
  }

  const inserted = resultRows(await database().query(
    `
      INSERT INTO leads (
        id, campaign_id, source_key, name, company, title, phone, email,
        linkedin_url, location, time_zone, source, stage, disposition, notes,
        follow_up_owner_email
      )
      SELECT incoming.id, incoming.campaign_id, incoming.source_key, incoming.name,
             incoming.company, incoming.title, incoming.phone, incoming.email,
             incoming.linkedin_url, incoming.location, incoming.time_zone,
             incoming.source, incoming.stage, incoming.disposition, incoming.notes,
             incoming.follow_up_owner_email
      FROM jsonb_to_recordset($1::jsonb) AS incoming(
        id TEXT, campaign_id TEXT, source_key TEXT, name TEXT, company TEXT,
        title TEXT, phone TEXT, email TEXT, linkedin_url TEXT, location TEXT,
        time_zone TEXT, source TEXT, stage TEXT, disposition TEXT, notes TEXT,
        follow_up_owner_email TEXT
      )
      ON CONFLICT (source_key) DO NOTHING
      RETURNING id
    `,
    [JSON.stringify(insertable)]
  ));
  return {
    imported: inserted.length,
    skipped: exact.size + insertable.length - inserted.length,
    rejected: conflicts.size,
  };
}

export async function listQueueResumePositions(campaignIds, actorEmail) {
  const ids = campaignIdsFrom(campaignIds);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!ids.length || !email) return [];
  const result = await database().query(`
    SELECT DISTINCT ON (campaign_id) campaign_id, lead_id, created_at AS last_call_at
    FROM lead_activities
    WHERE campaign_id = ANY($1::text[]) AND actor_email = $2
      AND activity_type = 'call'
    ORDER BY campaign_id, created_at DESC, id DESC
  `, [ids, email]);
  return resultRows(result);
}

export async function listPipeline(campaignIds, actorEmail = '', assignedOnly = false) {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!allowedCampaigns.length) return [];

  const result = await database().query(
    `
      SELECT
        leads.id,
        leads.campaign_id,
        campaigns.name AS campaign_name,
        leads.name,
        leads.company,
        leads.title,
        leads.phone,
        leads.email,
        leads.linkedin_url,
        leads.source,
        leads.location,
        leads.time_zone,
        leads.stage,
        leads.disposition,
        leads.notes,
        leads.next_follow_up_at,
        leads.follow_up_owner_email,
        leads.booked_by_email,
        leads.booked_at,
        COALESCE(deals.status, 'open') AS deal_status,
        COALESCE(
          deals.potential_commission_cents,
          leads.potential_commission_cents,
          campaigns.default_commission_cents
        ) AS potential_commission_cents,
        latest_activity.created_at AS last_activity_at,
        latest_activity.actor_email AS last_activity_by,
        latest_activity.note AS last_activity_note,
        latest_call.created_at AS last_call_at,
        latest_call.actor_email AS last_called_by,
        caller_call.created_at AS caller_last_call_at,
        caller_call.scheduled_for AS caller_next_follow_up_at,
        (SELECT COUNT(*)::int FROM lead_activities AS calls
          WHERE calls.lead_id = leads.id AND calls.activity_type = 'call') AS call_count,
        (
          SELECT COUNT(*)::int
          FROM lead_activities AS calendly_appointment
          WHERE calendly_appointment.lead_id = leads.id
            AND calendly_appointment.activity_type = 'appointment'
            AND calendly_appointment.note ILIKE '%calendly%'
        ) AS calendly_appointment_count,
        (SELECT COUNT(*)::int FROM lead_activities AS booking
          WHERE booking.lead_id = leads.id AND booking.activity_type = 'appointment'
            AND (booking.scheduled_for IS NOT NULL OR booking.note ILIKE '%calendly%')) AS booked_appointment_count,
        EXISTS (
          SELECT 1
          FROM lead_activities AS principal_activity
          WHERE principal_activity.lead_id = leads.id
            AND principal_activity.actor_email = $2
        ) AS worked_by_principal
      FROM leads
      INNER JOIN campaigns ON campaigns.id = leads.campaign_id
      LEFT JOIN deals ON deals.lead_id = leads.id
      LEFT JOIN LATERAL (
        SELECT created_at, actor_email, note
        FROM lead_activities
        WHERE lead_id = leads.id
        ORDER BY created_at DESC
        LIMIT 1
      ) AS latest_activity ON TRUE
      LEFT JOIN LATERAL (
        SELECT created_at, actor_email
        FROM lead_activities
        WHERE lead_id = leads.id AND activity_type = 'call'
        ORDER BY created_at DESC
        LIMIT 1
      ) AS latest_call ON TRUE
      LEFT JOIN LATERAL (
        SELECT created_at, scheduled_for FROM lead_activities
        WHERE lead_id = leads.id AND activity_type = 'call' AND actor_email = $2
        ORDER BY created_at DESC, id DESC LIMIT 1
      ) AS caller_call ON TRUE
      WHERE leads.campaign_id = ANY($1::text[])
        AND ($3::boolean = FALSE OR leads.follow_up_owner_email = $2)
        AND ${leadVisibilitySql('leads', '$2')}
      ORDER BY
        CASE leads.stage
          WHEN 'Appointment Set' THEN 0
          WHEN 'Pitched' THEN 1
          WHEN 'Qualified' THEN 2
          WHEN 'Contacted' THEN 3
          WHEN 'New' THEN 4
          WHEN 'Won' THEN 5
          WHEN 'Lost' THEN 6
          ELSE 7
        END,
        leads.updated_at DESC,
        leads.name
    `,
    [allowedCampaigns, email, assignedOnly]
  );
  return resultRows(result).map((lead) => ({ ...lead, queue_is_personal:Boolean(email), pipeline_eligible:hasBookedAppointment(lead), pipeline_lane:salesPipelineLane(lead) }));
}

export async function assignLead({ leadId, contractorEmail, campaignId }) {
  const email = cleanText(contractorEmail, 320).toLowerCase();
  const result = await database().query(
    `
      UPDATE leads
      SET campaign_id = $3, follow_up_owner_email = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, campaign_id, follow_up_owner_email, updated_at
    `,
    [cleanText(leadId, 128), email, cleanText(campaignId, 80)]
  );
  return resultRows(result)[0] || null;
}

export async function listCallHistory({ campaignIds, actorEmail = '', viewerEmail = '', contractorsOnly = false, offset = 0, limit = 50 }) {
  const ids = campaignIdsFrom(campaignIds);
  if (!ids.length) return { calls:[], total:0 };
  const email = cleanText(actorEmail, 320).toLowerCase();
  const pageSize = Math.max(1, Math.min(100, Number(limit) || 50));
  const start = Math.max(0, Number(offset) || 0);
  const where = `activity.campaign_id = ANY($1::text[])
    AND activity.activity_type = 'call'
    AND ($2 = '' OR activity.actor_email = $2)
    AND ($3::boolean = FALSE OR activity.actor_role = 'contractor')
    AND ${leadVisibilitySql('leads', '$6')}`;
  const params = [ids, email, Boolean(contractorsOnly)];
  const [calls, total] = await Promise.all([
    database().query(`SELECT activity.id, activity.lead_id, activity.campaign_id,
      leads.name AS lead_name, leads.company, leads.phone, leads.stage,
      campaigns.name AS campaign_name, activity.actor_email, activity.actor_role,
      activity.disposition, activity.note, activity.duration_seconds, activity.created_at
      FROM lead_activities AS activity
      INNER JOIN leads ON leads.id = activity.lead_id
      INNER JOIN campaigns ON campaigns.id = activity.campaign_id
      WHERE ${where}
      ORDER BY activity.created_at DESC, activity.id DESC
      LIMIT $4 OFFSET $5`, [...params, pageSize, start, cleanText(viewerEmail, 320).toLowerCase()]),
    database().query(`SELECT COUNT(*)::int AS total FROM lead_activities AS activity
      INNER JOIN leads ON leads.id = activity.lead_id
      WHERE ${where.replaceAll('$6', '$4')}`, [...params, cleanText(viewerEmail, 320).toLowerCase()]),
  ]);
  return { calls:resultRows(calls), total:resultRows(total)[0]?.total || 0 };
}

export async function getContractorCallReport({ campaignIds, from, to }) {
  const ids = campaignIdsFrom(campaignIds);
  const [roster, result] = await Promise.all([
    listContractors(),
    ids.length ? database().query(`
      SELECT actor_email,
        COUNT(*) FILTER (WHERE activity_type = 'call')::int AS calls,
        COUNT(*) FILTER (WHERE activity_type = 'call' AND disposition <> '')::int AS outcomes,
        COUNT(*) FILTER (WHERE activity_type = 'call' AND disposition IN ('Connected — qualified', 'Connected — follow up'))::int AS connected,
        COALESCE(SUM(duration_seconds) FILTER (WHERE activity_type = 'call'), 0)::int AS talk_seconds,
        COUNT(*) FILTER (WHERE activity_type = 'appointment' AND (scheduled_for IS NOT NULL OR note ILIKE '%calendly%'))::int AS appointments,
        MAX(created_at) FILTER (WHERE activity_type = 'call') AS last_call_at
      FROM lead_activities
      WHERE campaign_id = ANY($1::text[]) AND actor_role = 'contractor'
        AND created_at >= ($2::date::timestamp AT TIME ZONE 'America/Los_Angeles')
        AND created_at < (($3::date + 1)::timestamp AT TIME ZONE 'America/Los_Angeles')
      GROUP BY actor_email`, [ids, from, to]) : [],
  ]);
  const rows = new Map(roster.map((contractor) => [contractor.email.toLowerCase(), {
    email:contractor.email.toLowerCase(), name:contractor.name || contractor.email,
    calls:0, outcomes:0, connected:0, talk_seconds:0, appointments:0, last_call_at:null,
  }]));
  for (const record of resultRows(result)) {
    const email = record.actor_email.toLowerCase();
    rows.set(email, { name:rows.get(email)?.name || email, email, ...record });
  }
  const contractors = [...rows.values()].sort((a, b) => b.calls - a.calls || a.name.localeCompare(b.name));
  const totals = contractors.reduce((sum, row) => {
    for (const key of ['calls', 'outcomes', 'connected', 'talk_seconds', 'appointments']) sum[key] += Number(row[key]);
    return sum;
  }, { calls:0, outcomes:0, connected:0, talk_seconds:0, appointments:0 });
  return { from, to, timeZone:'America/Los_Angeles', contractors, totals };
}

export async function updateLeadProfile({ leadId, name, notes, previousName, previousNotes }) {
  const leadName = cleanText(name, 240);
  if (!leadName) throw new Error('A lead name is required.');
  const rows = resultRows(await database().query(
    `
      UPDATE leads
      SET name = $2, notes = $3, updated_at = NOW()
      WHERE id = $1 AND name = $4 AND notes = $5
      RETURNING id, campaign_id, name, notes
    `,
    [cleanText(leadId, 128), leadName, cleanText(notes, 12000), cleanText(previousName, 240), cleanText(previousNotes, 12000)]
  ));
  return rows[0] || null;
}

export async function listCampaignSummaries(campaignIds, actorEmail, assignedOnly = false) {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!allowedCampaigns.length) return [];
  const result = await database().query(
    `
      SELECT
        campaigns.id AS campaign_id,
        COUNT(DISTINCT leads.id)::int AS lead_count,
        COUNT(DISTINCT lead_activities.id) FILTER (
          WHERE ($2 = '' OR lead_activities.actor_email = $2)
            AND lead_activities.activity_type = 'call'
        )::int AS call_count,
        COUNT(DISTINCT lead_activities.id) FILTER (
          WHERE ($2 = '' OR lead_activities.actor_email = $2)
            AND lead_activities.activity_type = 'appointment'
        )::int AS appointment_count,
        COUNT(DISTINCT deals.id) FILTER (
          WHERE deals.status = 'won'
        )::int AS won_count
      FROM campaigns
      LEFT JOIN leads ON leads.campaign_id = campaigns.id
        AND ($3::boolean = FALSE OR leads.follow_up_owner_email = $2)
        AND ${leadVisibilitySql('leads', '$2')}
      LEFT JOIN lead_activities ON lead_activities.campaign_id = campaigns.id
      LEFT JOIN deals ON deals.campaign_id = campaigns.id
      WHERE campaigns.id = ANY($1::text[])
      GROUP BY campaigns.id
      ORDER BY campaigns.id
    `,
    [allowedCampaigns, email, assignedOnly]
  );
  return resultRows(result);
}

export async function listAppointments(campaignIds, actorEmail = '', assignedOnly = false) {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!allowedCampaigns.length) return [];
  const result = await database().query(
    `
      SELECT
        lead_activities.id,
        lead_activities.lead_id,
        lead_activities.campaign_id,
        campaigns.name AS campaign_name,
        leads.name AS lead_name,
        lead_activities.actor_email,
        lead_activities.actor_role,
        lead_activities.note,
        lead_activities.scheduled_for,
        lead_activities.created_at
      FROM lead_activities
      INNER JOIN leads ON leads.id = lead_activities.lead_id
      INNER JOIN campaigns ON campaigns.id = lead_activities.campaign_id
      WHERE lead_activities.campaign_id = ANY($1::text[])
        AND lead_activities.activity_type = 'appointment'
        AND ($3::boolean = FALSE OR leads.follow_up_owner_email = $2)
        AND ${leadVisibilitySql('leads', '$2')}
      ORDER BY COALESCE(lead_activities.scheduled_for, lead_activities.created_at) ASC,
               lead_activities.created_at DESC
    `,
    [allowedCampaigns, email, assignedOnly]
  );
  return resultRows(result);
}

export async function getLeadDetail(id, campaignIds, viewerEmail = '') {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
  const viewer = cleanText(viewerEmail, 320).toLowerCase();
  if (!allowedCampaigns.length) return null;
  const sql = database();
  const leadResult = await sql.query(
    `
      SELECT
        leads.*,
        campaigns.name AS campaign_name,
        COALESCE(deals.status, 'open') AS deal_status,
        COALESCE(
          deals.potential_commission_cents,
          leads.potential_commission_cents,
          campaigns.default_commission_cents
        ) AS potential_commission_cents,
        deals.closed_at,
        deals.closed_by,
        COALESCE((
          SELECT jsonb_agg(activity ORDER BY activity.created_at DESC, activity.id DESC)
          FROM (
            SELECT id, actor_email, actor_role, activity_type, disposition, note,
              duration_seconds, scheduled_for, resulting_stage, created_at
            FROM lead_activities WHERE lead_id = leads.id
          ) AS activity
        ), '[]'::jsonb) AS shared_activities
      FROM leads
      INNER JOIN campaigns ON campaigns.id = leads.campaign_id
      LEFT JOIN deals ON deals.lead_id = leads.id
      WHERE leads.id = $1
        AND leads.campaign_id = ANY($2::text[])
        AND ${leadVisibilitySql('leads', '$3')}
      LIMIT 1
    `,
    [cleanText(id, 128), allowedCampaigns, viewer]
  );
  const row = resultRows(leadResult)[0];
  if (!row) return null;
  const { shared_activities: activities = [], ...lead } = row;
  return { lead, activities };
}

export async function recordLeadActivity({
  leadId,
  actorEmail,
  actorRole,
  activityType,
  disposition,
  note,
  durationSeconds,
  scheduledFor,
  nextStage,
}) {
  if (!ACTIVITY_TYPES.has(activityType)) {
    throw new Error('Unsupported activity type.');
  }
  const stage = cleanText(nextStage, 80);
  if (stage && !WORKABLE_STAGES.has(stage)) {
    throw new Error('Deals can only be closed by an administrator.');
  }
  const confirmedBooking = activityType === 'appointment' && (cleanDate(scheduledFor) || /calendly/i.test(String(note || '')));
  if (actorRole === 'contractor' && (stage === 'Pitched' || (stage === 'Appointment Set' && !confirmedBooking))) {
    throw new Error('Book appointments through the scheduler. Admin manages presentations and sales stages.');
  }
  const duration = Number(durationSeconds || 0);
  if (!Number.isInteger(duration) || duration < 0 || duration > 12 * 60 * 60) {
    throw new Error('Call duration is invalid.');
  }

  const activityId = `activity_${crypto.randomUUID()}`;
  const result = await database().query(
    `
      WITH updated_lead AS (
        UPDATE leads
        SET
          stage = CASE
            WHEN $9 = 'appointment' AND ($11::timestamptz IS NOT NULL OR $4 ILIKE '%calendly%') THEN 'Appointment Set'
            WHEN $9 = 'call' AND stage = 'New' AND $2 IN ('', 'New')
              THEN CASE WHEN $3 = 'Connected — qualified' THEN 'Qualified' ELSE 'Contacted' END
            ELSE COALESCE(NULLIF($2, ''), stage)
          END,
          disposition = COALESCE(NULLIF($3, ''), disposition),
          notes = CASE
            WHEN $4 = '' THEN notes
            WHEN notes = '' THEN $4
            ELSE notes || chr(10) || chr(10) || $4
          END,
          next_follow_up_at = CASE
            WHEN $9 = 'appointment' THEN NULL::timestamptz
            ELSE $5::timestamptz
          END,
          -- Activity changes never transfer ownership. Assignment is an
          -- explicit admin operation, so an Admin stage move or contractor
          -- note cannot make a shared lead disappear from its owner.
          follow_up_owner_email = follow_up_owner_email,
          booked_by_email = CASE WHEN booked_at IS NULL AND $9 = 'appointment'
            AND ($11::timestamptz IS NOT NULL OR $4 ILIKE '%calendly%') THEN $7 ELSE booked_by_email END,
          booked_at = CASE WHEN booked_at IS NULL AND $9 = 'appointment'
            AND ($11::timestamptz IS NOT NULL OR $4 ILIKE '%calendly%') THEN NOW() ELSE booked_at END,
          updated_at = NOW()
        WHERE id = $1
          AND ($8 = 'admin' OR booked_at IS NULL OR (booked_by_email = $7
            AND $9 = 'note' AND $2 = ''))
        RETURNING id, campaign_id, stage, disposition, notes, next_follow_up_at,
                  follow_up_owner_email, booked_by_email, booked_at
      ), inserted_activity AS (
        INSERT INTO lead_activities (
          id, lead_id, campaign_id, actor_email, actor_role, activity_type,
          disposition, note, duration_seconds, scheduled_for, resulting_stage
        )
        SELECT $6, id, campaign_id, $7, $8, $9, $3, $4, $10, $11,
               stage
        FROM updated_lead
        RETURNING id, lead_id, campaign_id, actor_email, actor_role,
                  activity_type, disposition, note, duration_seconds,
                  scheduled_for, resulting_stage, created_at
      )
      SELECT
        (SELECT row_to_json(updated_lead) FROM updated_lead LIMIT 1) AS lead,
        (SELECT row_to_json(inserted_activity) FROM inserted_activity LIMIT 1) AS activity
    `,
    [
      cleanText(leadId, 128),
      stage,
      cleanText(disposition, 240),
      cleanText(note, 12000),
      cleanDate(scheduledFor),
      activityId,
      cleanText(actorEmail, 320).toLowerCase(),
      actorRole,
      activityType,
      duration,
      cleanDate(scheduledFor),
    ]
  );
  const row = resultRows(result)[0];
  if (!row?.lead || !row?.activity) throw new Error('Lead was not found or is no longer available.');
  return row;
}

// The established admin dialer is intentionally browser-first. Resolve its
// stable source identity on the server before recording an action, so that an
// admin call or note joins the same shared lead history a contractor sees.
export async function recordLegacyWorkspaceActivity({
  legacyLead,
  actorEmail,
  actorRole = 'admin',
  activityType,
  disposition,
  note,
  durationSeconds,
  scheduledFor,
  nextStage,
}) {
  const normalised = normaliseLegacyLead(legacyLead || {});
  if (!normalised.campaign_id) throw new Error('Lead campaign is required.');

  await importLegacyWorkspace({ leads: [legacyLead] });
  const result = await database().query(
    `
      SELECT id
      FROM leads
      WHERE source_key = $1
        AND campaign_id = $2
      LIMIT 1
    `,
    [normalised.source_key, normalised.campaign_id]
  );
  const lead = resultRows(result)[0];
  if (!lead) throw new Error('Lead was not found.');

  if (!activityType) return { lead };

  return recordLeadActivity({
    leadId: lead.id,
    actorEmail,
    actorRole,
    activityType,
    disposition,
    note,
    durationSeconds,
    scheduledFor,
    nextStage,
  });
}

export async function setDeal({
  leadId,
  status,
  potentialCommissionCents,
  closedBy,
  reopenStage,
}) {
  const nextStatus = cleanText(status, 16);
  if (!['open', 'won', 'lost'].includes(nextStatus)) {
    throw new Error('Choose an open, won, or lost deal status.');
  }
  const commission = cleanCents(potentialCommissionCents);
  const dealId = `deal_${crypto.randomUUID()}`;
  const activityId = `activity_${crypto.randomUUID()}`;
  const requestedReopenStage = cleanText(reopenStage, 80);
  const closingStage = nextStatus === 'won'
    ? 'Won'
    : nextStatus === 'lost'
      ? 'Lost'
      : WORKABLE_STAGES.has(requestedReopenStage)
        ? requestedReopenStage
        : null;
  const result = await database().query(
    `
      WITH target_lead AS (
        SELECT id, campaign_id
        FROM leads
        WHERE id = $1
      ), saved_deal AS (
        INSERT INTO deals (
          id, lead_id, campaign_id, status, potential_commission_cents,
          closed_at, closed_by, updated_at
        )
        SELECT $2, id, campaign_id, $3, $4,
               CASE WHEN $3 IN ('won', 'lost') THEN NOW() ELSE NULL END,
               CASE WHEN $3 IN ('won', 'lost') THEN $5 ELSE NULL END,
               NOW()
        FROM target_lead
        ON CONFLICT (lead_id) DO UPDATE
        SET status = EXCLUDED.status,
            potential_commission_cents = COALESCE(
              EXCLUDED.potential_commission_cents,
              deals.potential_commission_cents
            ),
            closed_at = CASE
              WHEN EXCLUDED.status IN ('won', 'lost') THEN NOW()
              ELSE NULL
            END,
            closed_by = CASE
              WHEN EXCLUDED.status IN ('won', 'lost') THEN $5
              ELSE NULL
            END,
            updated_at = NOW()
        RETURNING *
      ), updated_lead AS (
        UPDATE leads
        SET stage = COALESCE($6, stage), updated_at = NOW()
        WHERE id = $1
        RETURNING id, campaign_id, stage
      ), inserted_activity AS (
        INSERT INTO lead_activities (
          id, lead_id, campaign_id, actor_email, actor_role, activity_type,
          note, resulting_stage
        )
        SELECT $7, id, campaign_id, $5, 'admin', 'stage_change',
               'Deal marked ' || $3, $6
        FROM updated_lead
        RETURNING id, created_at
      )
      SELECT
        (SELECT row_to_json(saved_deal) FROM saved_deal LIMIT 1) AS deal,
        (SELECT row_to_json(updated_lead) FROM updated_lead LIMIT 1) AS lead,
        (SELECT row_to_json(inserted_activity) FROM inserted_activity LIMIT 1) AS activity
    `,
    [
      cleanText(leadId, 128),
      dealId,
      nextStatus,
      commission,
      cleanText(closedBy, 320).toLowerCase(),
      closingStage,
      activityId,
    ]
  );
  const row = resultRows(result)[0];
  if (!row?.deal || !row?.lead) throw new Error('Lead was not found.');
  return row;
}

export async function setCampaignCommission(campaignId, commissionCents) {
  const commission = cleanCents(commissionCents);
  if (commission === null) throw new Error('Commission must be a whole number of cents.');
  const result = await database().query(
    `
      UPDATE campaigns
      SET default_commission_cents = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, default_commission_cents, updated_at
    `,
    [cleanText(campaignId, 80), commission]
  );
  return resultRows(result)[0] || null;
}

export async function getContractorDailyDashboard({ campaignId, actorEmail, viewerEmail = actorEmail }) {
  const id = cleanText(campaignId, 80);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!id || !email) return { stats: {}, calls: [], followUps: [] };
  const sql = database();
  const [statsResult, callsResult, followUpsResult] = await Promise.all([
    sql.query(
      `
        SELECT
          COUNT(*) FILTER (WHERE activity_type = 'call')::int AS calls_today,
          COALESCE(SUM(duration_seconds) FILTER (WHERE activity_type = 'call'), 0)::int AS talk_seconds,
          COUNT(*) FILTER (WHERE activity_type = 'appointment')::int AS appointments_today,
          COALESCE(
            ROUND(
              100.0 * COUNT(*) FILTER (
                WHERE activity_type = 'call'
                  AND disposition IN ('Connected — qualified', 'Connected — follow up')
              ) / NULLIF(COUNT(*) FILTER (WHERE activity_type = 'call'), 0)
            ),
            0
          )::int AS connect_rate,
          (
            SELECT COUNT(*)::int
            FROM deals
            WHERE campaign_id = $1
              AND status = 'won'
              AND closed_at >= (date_trunc('day', NOW() AT TIME ZONE 'America/Los_Angeles') AT TIME ZONE 'America/Los_Angeles')
          ) AS deals_closed,
          (
            SELECT COUNT(*)::int
            FROM leads
            WHERE campaign_id = $1
              AND next_follow_up_at <= NOW()
              AND stage NOT IN ('Won', 'Lost', 'Do Not Call')
              AND ${leadVisibilitySql('leads', '$3')}
          ) AS follow_ups_due
        FROM lead_activities
        WHERE campaign_id = $1
          AND actor_email = $2
          AND created_at >= (date_trunc('day', NOW() AT TIME ZONE 'America/Los_Angeles') AT TIME ZONE 'America/Los_Angeles')
      `,
      [id, email, cleanText(viewerEmail, 320).toLowerCase()]
    ),
    sql.query(
      `
        SELECT
          lead_activities.id,
          lead_activities.lead_id,
          leads.name AS lead_name,
          lead_activities.disposition,
          lead_activities.note,
          lead_activities.duration_seconds,
          lead_activities.created_at
        FROM lead_activities
        INNER JOIN leads ON leads.id = lead_activities.lead_id
        WHERE lead_activities.campaign_id = $1
          AND lead_activities.actor_email = $2
          AND lead_activities.activity_type = 'call'
          AND ${leadVisibilitySql('leads', '$3')}
          AND lead_activities.created_at >= (date_trunc('day', NOW() AT TIME ZONE 'America/Los_Angeles') AT TIME ZONE 'America/Los_Angeles')
        ORDER BY lead_activities.created_at DESC
        LIMIT 100
      `,
      [id, email, cleanText(viewerEmail, 320).toLowerCase()]
    ),
    sql.query(
      `
        SELECT
          id, campaign_id, name, company, title, phone, email, location,
          time_zone, stage, disposition, notes, next_follow_up_at,
          follow_up_owner_email, potential_commission_cents
        FROM leads
        WHERE campaign_id = $1
          AND next_follow_up_at <= NOW()
          AND stage NOT IN ('Won', 'Lost', 'Do Not Call')
          AND ${leadVisibilitySql('leads', '$2')}
        ORDER BY next_follow_up_at ASC, updated_at DESC, name
      `,
      [id, cleanText(viewerEmail, 320).toLowerCase()]
    ),
  ]);
  return {
    stats: resultRows(statsResult)[0] || {
      calls_today: 0,
      talk_seconds: 0,
      appointments_today: 0,
      deals_closed: 0,
      connect_rate: 0,
      follow_ups_due: 0,
    },
    calls: resultRows(callsResult),
    followUps: resultRows(followUpsResult),
  };
}
