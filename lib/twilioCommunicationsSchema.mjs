export const twilioCommunicationsSchema = [
  `CREATE TABLE IF NOT EXISTS prospect_call_grants (
    id UUID PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    identity TEXT NOT NULL,
    actor_role TEXT NOT NULL CHECK (actor_role IN ('admin', 'contractor')),
    destination TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 minutes'),
    call_sid TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS prospect_call_grants_expiry_idx
    ON prospect_call_grants (expires_at)`,
  `CREATE TABLE IF NOT EXISTS prospect_sms (
    id UUID PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    actor_email TEXT NOT NULL,
    destination TEXT NOT NULL,
    body TEXT NOT NULL,
    consent_reference TEXT NOT NULL,
    message_sid TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'submitting',
    status_rank SMALLINT NOT NULL DEFAULT 0,
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS prospect_sms_lead_created_idx
    ON prospect_sms (lead_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS prospect_call_recordings (
    id UUID PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    actor_email TEXT NOT NULL,
    call_sid TEXT NOT NULL,
    recording_sid TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'starting',
    status_rank SMALLINT NOT NULL DEFAULT 0,
    duration_seconds INTEGER,
    notes TEXT NOT NULL DEFAULT '',
    consent_confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS prospect_call_recordings_created_idx
    ON prospect_call_recordings (consent_confirmed_at DESC, id DESC)`,
];
