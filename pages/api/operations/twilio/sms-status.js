import { authenticTwilioRequest, requestIdPattern, twilioConfig } from '../../../../lib/twilioCommunications';
import { updateTextStatus } from '../../../../lib/twilioCommunicationsStore';

export default async function smsStatus(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const settings = twilioConfig();
  const { id } = req.query;
  if (!settings.sms || typeof id !== 'string' || !requestIdPattern.test(id)
      || !authenticTwilioRequest(req, settings, `sms-status?id=${id}`)) {
    return res.status(403).end();
  }
  const { MessageSid: sid, MessageStatus: status, ErrorCode: errorCode } = req.body;
  if (!/^SM[\da-f]{32}$/i.test(sid)) return res.status(400).end();
  try {
    await updateTextStatus({ id, sid, status, errorCode });
    return res.status(204).end();
  } catch (error) {
    console.error('Unable to update Twilio text status', error.code || error.name);
    return res.status(503).end();
  }
}
