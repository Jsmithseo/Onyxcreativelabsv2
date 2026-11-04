import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

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

function legacyLeadIdentity(lead) {
  const email = cleanText(lead.email, 320).toLowerCase();
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

  await sql.query(
    `
      INSERT INTO leads (
        id, campaign_id, source_key, name, company, title, phone, email,
        linkedin_url, location, time_zone, source, stage, disposition, notes,
        next_follow_up_at, potential_commission_cents
      )
      SELECT
        incoming.id, incoming.campaign_id, incoming.source_key, incoming.name,
        incoming.company, incoming.title, incoming.phone, incoming.email,
        incoming.linkedin_url, incoming.location, incoming.time_zone,
        incoming.source, incoming.stage, incoming.disposition, incoming.notes,
        incoming.next_follow_up_at, incoming.potential_commission_cents
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

  return { campaigns: campaignRows.length, leads: leadRows.length };
}

export async function listPipeline(campaignIds, actorEmail = '') {
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
        leads.location,
        leads.time_zone,
        leads.stage,
        leads.disposition,
        leads.notes,
        leads.next_follow_up_at,
        leads.follow_up_owner_email,
        COALESCE(deals.status, 'open') AS deal_status,
        COALESCE(
          deals.potential_commission_cents,
          leads.potential_commission_cents,
          campaigns.default_commission_cents
        ) AS potential_commission_cents,
        latest_activity.created_at AS last_activity_at,
        latest_activity.actor_email AS last_activity_by,
        latest_activity.note AS last_activity_note,
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
      WHERE leads.campaign_id = ANY($1::text[])
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
    [allowedCampaigns, email]
  );
  return resultRows(result);
}

export async function listCampaignSummaries(campaignIds, actorEmail) {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
  const email = cleanText(actorEmail, 320).toLowerCase();
  if (!allowedCampaigns.length) return [];
  const result = await database().query(
    `
      SELECT
        campaigns.id AS campaign_id,
        COUNT(DISTINCT leads.id)::int AS lead_count,
        COUNT(DISTINCT lead_activities.id) FILTER (
          WHERE lead_activities.actor_email = $2
            AND lead_activities.activity_type = 'call'
        )::int AS call_count,
        COUNT(DISTINCT lead_activities.id) FILTER (
          WHERE lead_activities.actor_email = $2
            AND lead_activities.activity_type = 'appointment'
        )::int AS appointment_count,
        COUNT(DISTINCT deals.id) FILTER (
          WHERE deals.status = 'won'
        )::int AS won_count
      FROM campaigns
      LEFT JOIN leads ON leads.campaign_id = campaigns.id
      LEFT JOIN lead_activities ON lead_activities.campaign_id = campaigns.id
      LEFT JOIN deals ON deals.campaign_id = campaigns.id
      WHERE campaigns.id = ANY($1::text[])
      GROUP BY campaigns.id
      ORDER BY campaigns.id
    `,
    [allowedCampaigns, email]
  );
  return resultRows(result);
}

export async function getLeadDetail(id, campaignIds) {
  const allowedCampaigns = campaignIdsFrom(campaignIds);
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
        deals.closed_by
      FROM leads
      INNER JOIN campaigns ON campaigns.id = leads.campaign_id
      LEFT JOIN deals ON deals.lead_id = leads.id
      WHERE leads.id = $1
        AND leads.campaign_id = ANY($2::text[])
      LIMIT 1
    `,
    [cleanText(id, 128), allowedCampaigns]
  );
  const lead = resultRows(leadResult)[0];
  if (!lead) return null;

  const activityResult = await sql.query(
    `
      SELECT id, actor_email, actor_role, activity_type, disposition, note,
             duration_seconds, scheduled_for, resulting_stage, created_at
      FROM lead_activities
      WHERE lead_id = $1
      ORDER BY created_at DESC
    `,
    [lead.id]
  );
  return { lead, activities: resultRows(activityResult) };
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
          stage = COALESCE(NULLIF($2, ''), stage),
          disposition = COALESCE(NULLIF($3, ''), disposition),
          notes = CASE
            WHEN $4 = '' THEN notes
            WHEN notes = '' THEN $4
            ELSE notes || E'\\n\\n' || $4
          END,
          next_follow_up_at = CASE
            WHEN $9 = 'appointment' THEN NULL::timestamptz
            ELSE $5::timestamptz
          END,
          follow_up_owner_email = CASE
            WHEN $9 = 'appointment' THEN NULL
            WHEN $5::timestamptz IS NULL THEN NULL
            ELSE $7
          END,
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, campaign_id, stage, disposition, notes, next_follow_up_at,
                  follow_up_owner_email
      ), inserted_activity AS (
        INSERT INTO lead_activities (
          id, lead_id, campaign_id, actor_email, actor_role, activity_type,
          disposition, note, duration_seconds, scheduled_for, resulting_stage
        )
        SELECT $6, id, campaign_id, $7, $8, $9, $3, $4, $10, $11,
               NULLIF($2, '')
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
  if (!row?.lead || !row?.activity) throw new Error('Lead was not found.');
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

export async function getContractorDailyDashboard({ campaignId, actorEmail }) {
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
              AND closed_at >= date_trunc('day', NOW())
          ) AS deals_closed,
          (
            SELECT COUNT(*)::int
            FROM leads
            WHERE campaign_id = $1
              AND follow_up_owner_email = $2
              AND next_follow_up_at <= NOW()
              AND stage NOT IN ('Won', 'Lost', 'Do Not Call')
          ) AS follow_ups_due
        FROM lead_activities
        WHERE campaign_id = $1
          AND actor_email = $2
          AND created_at >= date_trunc('day', NOW())
      `,
      [id, email]
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
          AND lead_activities.created_at >= date_trunc('day', NOW())
        ORDER BY lead_activities.created_at DESC
        LIMIT 100
      `,
      [id, email]
    ),
    sql.query(
      `
        SELECT
          id, campaign_id, name, company, title, phone, email, location,
          time_zone, stage, disposition, notes, next_follow_up_at,
          follow_up_owner_email, potential_commission_cents
        FROM leads
        WHERE campaign_id = $1
          AND follow_up_owner_email = $2
          AND next_follow_up_at <= NOW()
          AND stage NOT IN ('Won', 'Lost', 'Do Not Call')
        ORDER BY next_follow_up_at ASC, updated_at DESC, name
      `,
      [id, email]
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
