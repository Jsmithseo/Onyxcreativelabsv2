import { randomUUID } from 'node:crypto';
import {
  contactLead, contactPrincipal, prospectPhone, twilioConfig, voiceIdentity, voiceToken,
} from '../../../../lib/twilioCommunications';
import { createCallGrant } from '../../../../lib/twilioCommunicationsStore';

export default async function voiceSession(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  try {
    const principal = await contactPrincipal(req, res);
    if (!principal) return;
    const settings = twilioConfig();
    if (!settings.voice) return res.status(503).json({ error: 'Twilio calling is unavailable.' });
    const lead = await contactLead(res, principal, req.body?.leadId);
    if (!lead) return;
    const destination = prospectPhone(lead.phone);
    if (!destination) return res.status(422).json({ error: 'This lead has no valid phone number.' });
    if (destination !== prospectPhone(req.body?.expectedPhone)) {
      return res.status(409).json({ error: 'The lead’s phone number changed. Refresh the lead before calling.' });
    }
    const id = randomUUID();
    const identity = voiceIdentity(principal);
    const token = voiceToken(settings, identity);
    await createCallGrant({ id, leadId: lead.id, identity, role: principal.role, destination });
    return res.status(200).json({ token, grantId: id });
  } catch (error) {
    console.error('Unable to authorize Twilio call', error.code || error.name);
    return res.status(503).json({ error: 'Unable to start the call. Try again.' });
  }
}
