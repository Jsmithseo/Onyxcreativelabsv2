import { createHash } from 'node:crypto';
import twilio from 'twilio';
import { currentOperationsPrincipal } from './operationsAccess';
import { getLeadDetail, listCampaigns } from './operationsStore';

const smsFooter = '\nReply STOP to unsubscribe.';
export const requestIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

export function prospectPhone(value) {
  const raw = String(value || '').trim();
  if (!/^\+?[\d\s().-]+$/.test(raw)) return '';
  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : '';
  if (/^[2-9]\d{9}$/.test(digits)) return `+1${digits}`;
  if (/^1[2-9]\d{9}$/.test(digits)) return `+${digits}`;
  return '';
}

function webhookOrigin() {
  try {
    const url = new URL(process.env.TWILIO_WEBHOOK_ORIGIN);
    if (url.protocol === 'https:' && !url.username && !url.password && url.href === `${url.origin}/`) {
      return url.origin;
    }
  } catch {}
  return '';
}

export function twilioConfig() {
  const {
    TWILIO_ACCOUNT_SID: accountSid,
    TWILIO_AUTH_TOKEN: authToken,
    TWILIO_API_KEY_SID: apiKeySid,
    TWILIO_API_KEY_SECRET: apiKeySecret,
    TWILIO_TWIML_APP_SID: appSid,
    TWILIO_VOICE_NUMBER: callerId,
    TWILIO_MESSAGING_SERVICE_SID: messagingServiceSid,
    TWILIO_SMS_SENDER_NAME: senderName,
  } = process.env;
  const origin = webhookOrigin();
  const base = Boolean(/^AC[\da-f]{32}$/i.test(accountSid) && authToken && origin);
  const voice = Boolean(base && /^SK[\da-f]{32}$/i.test(apiKeySid) && apiKeySecret
    && /^AP[\da-f]{32}$/i.test(appSid) && prospectPhone(callerId));
  return {
    accountSid, authToken, origin, apiKeySid, apiKeySecret, appSid,
    callerId: prospectPhone(callerId),
    messagingServiceSid,
    senderName: senderName?.trim() || 'Onyx Creative Labs',
    voice,
    recordings: voice && process.env.TWILIO_TRAINING_RECORDINGS === 'true',
    sms: Boolean(base && /^MG[\da-f]{32}$/i.test(messagingServiceSid)),
  };
}

export function twilioWebhookUrl(settings, path) {
  return `${settings.origin}/api/operations/twilio/${path}`;
}

export function authenticTwilioRequest(req, settings, path) {
  const signature = req.headers['x-twilio-signature'];
  return typeof signature === 'string'
    && req.body?.AccountSid === settings.accountSid
    && twilio.validateRequest(settings.authToken, signature, twilioWebhookUrl(settings, path), req.body);
}

export async function contactPrincipal(req, res) {
  const principal = await currentOperationsPrincipal(req, { allowDevelopmentPreview: false });
  if (!principal) res.status(401).json({ error: 'Sign in to contact a prospect.' });
  return principal;
}

export async function contactLead(res, principal, leadId, { readOnly = false } = {}) {
  const admin = principal.role === 'admin';
  const campaigns = admin ? (await listCampaigns()).map((campaign) => campaign.id) : principal.campaignIds;
  const detail = typeof leadId === 'string' && await getLeadDetail(leadId, campaigns, admin ? '' : principal.email);
  if (!detail) {
    res.status(404).json({ error: 'Lead not found.' });
    return null;
  }
  const { lead } = detail;
  if (!readOnly && (lead.stage === 'Do Not Call' || (!admin && lead.booked_at))) {
    res.status(409).json({ error: 'This lead is unavailable for outreach.' });
    return null;
  }
  return lead;
}

export function voiceIdentity(principal) {
  return `onyx_${createHash('sha256').update(`${principal.role}:${principal.email}`).digest('hex').slice(0, 40)}`;
}

export function voiceToken(settings, identity) {
  const AccessToken = twilio.jwt.AccessToken;
  const token = new AccessToken(settings.accountSid, settings.apiKeySid, settings.apiKeySecret, {
    identity, ttl: 3600,
  });
  token.addGrant(new AccessToken.VoiceGrant({ outgoingApplicationSid: settings.appSid }));
  return token.toJwt();
}

export function prospectText(senderName, input) {
  if (typeof input !== 'string' || !input.trim()) return '';
  const body = `${senderName}: ${input.trim()}${smsFooter}`;
  return body.length <= 1600 ? body : '';
}

export function messageClient(settings) {
  return twilio(settings.accountSid, settings.authToken, { timeout: 8000, autoRetry: false });
}
