import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { requestIdPattern, twilioConfig } from '../../../../../lib/twilioCommunications';
import { trainingLibraryAdmin } from '../../../../../lib/twilioRecordingAccess';
import { findTrainingRecording } from '../../../../../lib/twilioRecordingsStore';

export const config = { api: { responseLimit: false } };

export default async function recordingAudio(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }
  try {
    if (!await trainingLibraryAdmin(req, res)) return;
    const { id } = req.query;
    if (typeof id !== 'string' || !requestIdPattern.test(id)) return res.status(404).end();
    const recording = await findTrainingRecording(id);
    if (recording?.status !== 'completed' || !/^RE[\da-f]{32}$/i.test(recording.recording_sid)) {
      return res.status(404).end();
    }
    const { accountSid, authToken } = twilioConfig();
    if (!/^AC[\da-f]{32}$/i.test(accountSid) || !authToken) return res.status(503).end();
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const range = typeof req.headers.range === 'string' && /^bytes=\d*-\d*$/.test(req.headers.range)
      ? req.headers.range : undefined;
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recording.recording_sid}.mp3`,
      {
        method: req.method,
        headers: {
          Authorization: `Basic ${auth}`,
          ...(range && { Range: range }),
        },
        signal: AbortSignal.timeout(60000),
      }
    );
    if ([404, 416].includes(response.status)) {
      await response.body?.cancel();
      return res.status(response.status).end();
    }
    if (!response.ok || (req.method === 'GET' && !response.body)) {
      await response.body?.cancel();
      return res.status(502).end();
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    for (const header of ['accept-ranges', 'content-range', 'content-length']) {
      const value = response.headers.get(header);
      if (value) res.setHeader(header, value);
    }
    res.status(response.status);
    if (req.method === 'HEAD') return res.end();
    await pipeline(Readable.fromWeb(response.body), res);
  } catch (error) {
    if (res.headersSent) return res.destroy();
    console.error('Unable to stream training recording', error.code || error.name);
    return res.status(503).end();
  }
}
