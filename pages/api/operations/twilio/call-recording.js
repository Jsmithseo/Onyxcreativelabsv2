import {
  contactPrincipal, messageClient, requestIdPattern, twilioConfig, twilioWebhookUrl, voiceIdentity,
} from '../../../../lib/twilioCommunications';
import {
  findClaimedCall, findTrainingRecording, reserveRecording, saveRecordingStatus,
} from '../../../../lib/twilioRecordingsStore';

export default async function callRecording(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  try {
    const principal = await contactPrincipal(req, res);
    if (!principal) return;
    const settings = twilioConfig();
    if (!settings.recordings) return res.status(503).json({ error: 'Training recording is unavailable.' });
    const { grantId, action, consentConfirmed } = req.body || {};
    if (typeof grantId !== 'string' || !requestIdPattern.test(grantId) || !['start', 'stop'].includes(action)) {
      return res.status(400).json({ error: 'Select a connected call.' });
    }
    if (action === 'start' && consentConfirmed !== true) {
      return res.status(400).json({ error: 'Confirm the prospect agreed to training recording.' });
    }
    const call = await findClaimedCall(grantId, voiceIdentity(principal));
    if (!call) return res.status(404).json({ error: 'The connected call was not found.' });
    const client = messageClient(settings);

    if (action === 'stop') {
      const recording = await findTrainingRecording(call.id);
      if (!recording?.recording_sid) {
        return res.status(409).json({ error: 'Recording status is pending. End the call if you need recording to stop now.' });
      }
      if (['completed', 'absent', 'stopped'].includes(recording.status)) {
        return res.status(200).json({ status: recording.status });
      }
      await client.calls(call.call_sid).recordings(recording.recording_sid).update({ status: 'stopped' });
      await saveRecordingStatus({ id: call.id, callSid: call.call_sid, recordingSid: recording.recording_sid, status: 'stopped' });
      return res.status(200).json({ status: 'stopped' });
    }

    const answered = await client.calls.list({ parentCallSid: call.call_sid, status: 'in-progress', limit: 1 });
    if (!answered.length) return res.status(409).json({ error: 'Wait until the prospect answers before recording.' });
    if (!await reserveRecording(call, principal.email)) {
      const existing = await findTrainingRecording(call.id);
      return res.status(200).json({ status: existing.status });
    }

    let recording;
    try {
      recording = await client.calls(call.call_sid).recordings.create({
        recordingChannels: 'dual',
        recordingTrack: 'both',
        recordingStatusCallback: twilioWebhookUrl(settings, `recording-status?id=${call.id}`),
        recordingStatusCallbackEvent: ['in-progress', 'completed', 'absent'],
        recordingStatusCallbackMethod: 'POST',
      });
    } catch (error) {
      const status = error.status >= 400 && error.status < 500 ? 'failed' : 'unconfirmed';
      const current = await saveRecordingStatus({ id: call.id, callSid: call.call_sid, status });
      if (!current) return res.status(200).json({ status: (await findTrainingRecording(call.id)).status });
      return res.status(200).json({ status });
    }
    const saved = await saveRecordingStatus({
      id: call.id, callSid: call.call_sid, recordingSid: recording.sid, status: 'in-progress',
    });
    return res.status(200).json({ status: saved?.status || (await findTrainingRecording(call.id)).status });
  } catch (error) {
    console.error('Unable to update training recording', error.code || error.name);
    return res.status(503).json({ error: 'Recording status could not be confirmed. End the call if you need recording to stop now.' });
  }
}
