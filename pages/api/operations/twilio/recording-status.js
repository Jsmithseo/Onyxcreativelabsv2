import { authenticTwilioRequest, requestIdPattern, twilioConfig } from '../../../../lib/twilioCommunications';
import { saveRecordingStatus } from '../../../../lib/twilioRecordingsStore';

export default async function recordingStatus(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const settings = twilioConfig();
  const { id } = req.query;
  if (!settings.voice || typeof id !== 'string' || !requestIdPattern.test(id)
      || !authenticTwilioRequest(req, settings, `recording-status?id=${id}`)) {
    return res.status(403).end();
  }
  const { CallSid: callSid, RecordingSid: recordingSid, RecordingStatus: status, RecordingDuration } = req.body;
  if (!/^CA[\da-f]{32}$/i.test(callSid) || !/^RE[\da-f]{32}$/i.test(recordingSid)) return res.status(400).end();
  const seconds = Number(RecordingDuration);
  const duration = Number.isInteger(seconds) && seconds >= 0 && seconds <= 86400 ? seconds : null;
  try {
    await saveRecordingStatus({ id, callSid, recordingSid, status, duration });
    return res.status(204).end();
  } catch (error) {
    console.error('Unable to update training recording status', error.code || error.name);
    return res.status(503).end();
  }
}
