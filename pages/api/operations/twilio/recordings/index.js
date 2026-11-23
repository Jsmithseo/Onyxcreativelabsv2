import { requestIdPattern } from '../../../../../lib/twilioCommunications';
import { trainingLibraryAdmin } from '../../../../../lib/twilioRecordingAccess';
import { listTrainingRecordings, updateRecordingNotes } from '../../../../../lib/twilioRecordingsStore';

export default async function recordings(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).end();
  }
  try {
    if (!await trainingLibraryAdmin(req, res)) return;
    if (req.method === 'PATCH') {
      const { id, notes } = req.body || {};
      if (typeof id !== 'string' || !requestIdPattern.test(id) || typeof notes !== 'string' || notes.length > 3000) {
        return res.status(400).json({ error: 'Enter up to 3,000 characters of training notes.' });
      }
      const updated = await updateRecordingNotes(id, notes.trim());
      return updated ? res.status(200).json(updated) : res.status(404).json({ error: 'Recording not found.' });
    }
    const offset = Number(req.query.offset || 0);
    const search = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 160) : '';
    if (!Number.isSafeInteger(offset) || offset < 0) return res.status(400).end();
    const rows = await listTrainingRecordings(search, offset);
    return res.status(200).json({ recordings: rows.slice(0, 25), hasMore: rows.length > 25 });
  } catch (error) {
    console.error('Unable to open training recordings', error.code || error.name);
    return res.status(503).json({ error: 'The training library is temporarily unavailable.' });
  }
}
