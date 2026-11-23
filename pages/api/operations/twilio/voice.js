import twilio from 'twilio';
import {
  authenticTwilioRequest, requestIdPattern, twilioConfig,
} from '../../../../lib/twilioCommunications';
import { claimCallGrant } from '../../../../lib/twilioCommunicationsStore';

export default async function voice(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const settings = twilioConfig();
  if (!settings.voice || !authenticTwilioRequest(req, settings, 'voice')) {
    return res.status(403).end();
  }
  try {
    const { GrantId, From, CallSid } = req.body;
    const identity = /^client:(onyx_[a-f0-9]{40})$/.exec(From)?.[1];
    const destination = identity && typeof GrantId === 'string' && requestIdPattern.test(GrantId) && /^CA[\da-f]{32}$/i.test(CallSid)
      ? await claimCallGrant({ id: GrantId, identity, callSid: CallSid })
      : null;
    if (!destination) return res.status(403).end();
    const response = new twilio.twiml.VoiceResponse();
    response.dial({ callerId: settings.callerId, answerOnBridge: true, timeout: 30 }).number(destination);
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(response.toString());
  } catch (error) {
    console.error('Unable to route Twilio call', error.code || error.name);
    return res.status(503).end();
  }
}
