import { operationsDatabase } from './operationsStore';

function rows(result) {
  return Array.isArray(result) ? result : result.rows;
}

export async function createCallGrant({ id, leadId, identity, role, destination }) {
  const sql = operationsDatabase();
  await sql.query(`DELETE FROM prospect_call_grants WHERE expires_at <= NOW()
    AND (call_sid IS NULL OR expires_at < NOW() - INTERVAL '1 day')`);
  await sql.query(
    `INSERT INTO prospect_call_grants (id, lead_id, identity, actor_role, destination)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, leadId, identity, role, destination]
  );
}

export async function claimCallGrant({ id, identity, callSid }) {
  const result = await operationsDatabase().query(
    `UPDATE prospect_call_grants AS pending
     SET call_sid = $3
     FROM leads
     WHERE pending.id = $1 AND pending.identity = $2 AND pending.expires_at > NOW()
       AND (pending.call_sid IS NULL OR pending.call_sid = $3)
       AND leads.id = pending.lead_id AND leads.stage <> 'Do Not Call'
       AND (pending.actor_role = 'admin' OR leads.booked_at IS NULL)
     RETURNING pending.destination`,
    [id, identity, callSid]
  );
  return rows(result)[0]?.destination;
}

const messageFields = 'id, body, status, error_code, created_at';

export async function reserveText({ id, leadId, actorEmail, destination, body, consentReference, actorRole }) {
  const sql = operationsDatabase();
  const values = [id, leadId, actorEmail, destination, body, consentReference];
  const result = await sql.query(
    `INSERT INTO prospect_sms (id, lead_id, actor_email, destination, body, consent_reference)
     SELECT $1, $2, $3, $4, $5, $6
     FROM leads WHERE id = $2 AND stage <> 'Do Not Call'
       AND ($7 = 'admin' OR booked_at IS NULL)
     ON CONFLICT (id) DO NOTHING
     RETURNING ${messageFields}`,
    [...values, actorRole]
  );
  const inserted = rows(result)[0];
  if (inserted) return { message: inserted, isNew: true };

  const existing = await sql.query(
    `SELECT ${messageFields} FROM prospect_sms
     WHERE id = $1 AND lead_id = $2 AND actor_email = $3
       AND destination = $4 AND body = $5 AND consent_reference = $6`,
    values
  );
  return { message: rows(existing)[0], isNew: false };
}

const statusRanks = new Map([
  ['submission-unknown', 1],
  ['accepted', 2],
  ['queued', 3],
  ['sending', 4],
  ['sent', 5],
  ['delivered', 6],
  ['undelivered', 6],
  ['failed', 6],
  ['canceled', 6],
]);

export async function updateTextStatus({ id, sid, status, errorCode }) {
  const rank = statusRanks.get(status);
  if (!rank) return null;
  const sql = operationsDatabase();
  const result = await sql.query(
    `UPDATE prospect_sms
     SET message_sid = COALESCE(message_sid, $2), status = $3, status_rank = $4, error_code = $5
     WHERE id = $1 AND status_rank < $4 AND (message_sid IS NULL OR message_sid = $2)
     RETURNING ${messageFields}`,
    [id, sid || null, status, rank, errorCode || null]
  );
  // A status webhook can arrive before the send API returns.
  return rows(result)[0] || rows(await sql.query(
    `SELECT ${messageFields} FROM prospect_sms WHERE id = $1`,
    [id]
  ))[0];
}

export async function listProspectTexts(leadId) {
  return rows(await operationsDatabase().query(
    `SELECT ${messageFields} FROM prospect_sms
     WHERE lead_id = $1 ORDER BY created_at DESC, id DESC LIMIT 20`,
    [leadId]
  ));
}
