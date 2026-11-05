import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to migrate shared operations data.');
}

const sql = neon(databaseUrl);

const statements = [
  `
    CREATE TABLE IF NOT EXISTS operations_schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      default_commission_cents INTEGER NOT NULL DEFAULT 0
        CHECK (default_commission_cents >= 0),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
      source_key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      linkedin_url TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      time_zone TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT '',
      stage TEXT NOT NULL DEFAULT 'New'
        CHECK (stage IN ('New', 'Contacted', 'Qualified', 'Appointment Set', 'Pitched', 'Won', 'Lost', 'Do Not Call')),
      disposition TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      next_follow_up_at TIMESTAMPTZ,
      follow_up_owner_email TEXT,
      potential_commission_cents INTEGER
        CHECK (potential_commission_cents IS NULL OR potential_commission_cents >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,
  `
    ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS follow_up_owner_email TEXT
  `,
  `
    CREATE INDEX IF NOT EXISTS leads_campaign_stage_idx
      ON leads (campaign_id, stage)
  `,
  `
    CREATE INDEX IF NOT EXISTS leads_follow_up_owner_idx
      ON leads (campaign_id, follow_up_owner_email, next_follow_up_at)
  `,
  `
    CREATE TABLE IF NOT EXISTS lead_activities (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
      actor_email TEXT NOT NULL,
      actor_role TEXT NOT NULL CHECK (actor_role IN ('admin', 'contractor')),
      activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'note', 'appointment', 'stage_change')),
      disposition TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
      scheduled_for TIMESTAMPTZ,
      resulting_stage TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,
  `
    CREATE INDEX IF NOT EXISTS lead_activities_lead_created_idx
      ON lead_activities (lead_id, created_at DESC)
  `,
  `
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
      potential_commission_cents INTEGER
        CHECK (potential_commission_cents IS NULL OR potential_commission_cents >= 0),
      closed_at TIMESTAMPTZ,
      closed_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `,
  `
    CREATE INDEX IF NOT EXISTS deals_campaign_status_idx
      ON deals (campaign_id, status)
  `,
];

for (const statement of statements) {
  await sql.query(statement);
}

const campaigns = [
  ['school', 'Parsity School', 'Career-ready technology training outreach.'],
  ['warm-parsity-school', 'Warm Parsity School Leads', 'Warm school lead follow-up.'],
  ['business', 'Parsity Business', 'AI-assisted engineering training outreach.'],
  ['reviews', 'Onyx Reviews', 'Client review outreach.'],
  ['quantum-bom', 'Quantum Bom', 'Industrial estimating outreach.'],
];

for (const [id, name, description] of campaigns) {
  await sql.query(
    `
      INSERT INTO campaigns (id, name, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
    `,
    [id, name, description]
  );
}

await sql.query(
  `
    INSERT INTO operations_schema_migrations (id)
    VALUES ($1)
    ON CONFLICT (id) DO NOTHING
  `,
  ['shared-operations-v2']
);

console.log('Shared operations schema is ready.');
