import { operationsDatabase } from './operationsStore';

function rows(result) {
  return Array.isArray(result) ? result : result.rows;
}

export async function findClaimedCall(id, identity) {
  return rows(await operationsDatabase().query(
    `SELECT id, lead_id, call_sid FROM prospect_call_grants
     WHERE id = $1 AND identity = $2 AND call_sid IS NOT NULL
       AND expires_at >= NOW() - INTERVAL '1 day'`,
    [id, identity]
  ))[0];
}

export async function reserveRecording(call, email) {
  return rows(await operationsDatabase().query(
    `INSERT INTO prospect_call_recordings (id, lead_id, actor_email, call_sid)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [call.id, call.lead_id, email, call.call_sid]
  ))[0];
}

const rankedStatus = new Map([
  ['unconfirmed', 1], ['in-progress', 2], ['stopped', 3],
  ['completed', 4], ['absent', 4], ['failed', 4],
]);

export async function saveRecordingStatus({ id, callSid, recordingSid, status, duration }) {
  const rank = rankedStatus.get(status);
  if (!rank) return null;
  return rows(await operationsDatabase().query(
    `UPDATE prospect_call_recordings
     SET recording_sid = COALESCE(recording_sid, $3), status = $4,
         status_rank = $5, duration_seconds = COALESCE($6, duration_seconds)
     WHERE id = $1 AND call_sid = $2 AND status_rank < $5
       AND (recording_sid IS NULL OR recording_sid = $3)
     RETURNING status, recording_sid`,
    [id, callSid, recordingSid || null, status, rank, duration ?? null]
  ))[0];
}

export async function findTrainingRecording(id) {
  return rows(await operationsDatabase().query(
    `SELECT id, actor_email, call_sid, status, recording_sid
     FROM prospect_call_recordings WHERE id = $1`,
    [id]
  ))[0];
}

export async function listTrainingRecordings(search, offset) {
  const escaped = search.replace(/[\\%_]/g, '\\$&');
  return rows(await operationsDatabase().query(
    `SELECT recordings.id, leads.name AS lead_name, leads.company, recordings.actor_email,
           recordings.status, recordings.duration_seconds, recordings.notes,
           recordings.consent_confirmed_at AS recorded_at
     FROM prospect_call_recordings AS recordings
     JOIN leads ON leads.id = recordings.lead_id
     WHERE recordings.status IN ('in-progress', 'stopped', 'completed', 'absent', 'unconfirmed')
       AND ($1 = '' OR concat_ws(' ', leads.name, leads.company, recordings.actor_email,
         to_char(timezone('America/Los_Angeles', recordings.consent_confirmed_at), 'YYYY-MM-DD'),
         recordings.notes) ILIKE '%' || $1 || '%')
     ORDER BY recordings.consent_confirmed_at DESC, recordings.id DESC
     LIMIT 26 OFFSET $2`,
    [escaped, offset]
  ));
}

export async function updateRecordingNotes(id, notes) {
  return rows(await operationsDatabase().query(
    'UPDATE prospect_call_recordings SET notes = $2 WHERE id = $1 RETURNING id, notes',
    [id, notes]
  ))[0];
}
