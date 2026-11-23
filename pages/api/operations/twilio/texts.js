import {
  contactLead, contactPrincipal, messageClient, prospectPhone, prospectText,
  requestIdPattern, twilioConfig, twilioWebhookUrl,
} from '../../../../lib/twilioCommunications';
import { listProspectTexts, reserveText, updateTextStatus } from '../../../../lib/twilioCommunicationsStore';

export default async function texts(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  }
  try {
    const principal = await contactPrincipal(req, res);
    if (!principal) return;
    const settings = twilioConfig();
    if (!settings.sms) return res.status(503).json({ error: 'Twilio texting is unavailable.' });
    const readOnly = req.method === 'GET';
    const leadId = readOnly ? req.query.leadId : req.body?.leadId;
    const lead = await contactLead(res, principal, leadId, { readOnly });
    if (!lead) return;
    const destination = prospectPhone(lead.phone);
    if (readOnly) return res.status(200).json({ recipient: destination, messages: await listProspectTexts(lead.id) });

    const { id, text, expectedPhone, consentConfirmed, consentReference: reference } = req.body;
    const body = prospectText(settings.senderName, text);
    const consentReference = typeof reference === 'string' ? reference.trim() : '';
    if (!destination) return res.status(422).json({ error: 'This lead has no valid phone number.' });
    if (destination !== expectedPhone) return res.status(409).json({ error: 'The lead’s phone number changed. Refresh text history and confirm the recipient again.' });
    if (typeof id !== 'string' || !requestIdPattern.test(id) || !body || consentConfirmed !== true || !consentReference || consentReference.length > 500) {
      return res.status(400).json({ error: 'Enter a message and confirm where this prospect gave written SMS consent.' });
    }
    const { message, isNew } = await reserveText({
      id, leadId: lead.id, actorEmail: principal.email, actorRole: principal.role, destination, body, consentReference,
    });
    if (!message) return res.status(409).json({ error: 'This text could not be submitted. Reopen the lead and try again.' });
    if (!isNew) return res.status(200).json({ message });

    let update;
    try {
      const submitted = await messageClient(settings).messages.create({
        to: destination, body, messagingServiceSid: settings.messagingServiceSid,
        statusCallback: twilioWebhookUrl(settings, `sms-status?id=${id}`),
      });
      update = { sid: submitted.sid, status: submitted.status || 'accepted', errorCode: submitted.errorCode };
    } catch (error) {
      const rejected = error.status >= 400 && error.status < 500;
      update = { status: rejected ? 'failed' : 'submission-unknown', errorCode: error.code };
    }
    const saved = await updateTextStatus({ id, ...update });
    return res.status(201).json({ message: saved || message });
  } catch (error) {
    console.error('Unable to process Twilio text', error.code || error.name);
    return res.status(503).json({ error: 'Unable to process the text. Check text history before sending again.' });
  }
}
