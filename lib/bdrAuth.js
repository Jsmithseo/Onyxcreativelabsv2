import crypto from 'crypto';

const MAGIC_LINK_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decode(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

function signature(value) {
  return crypto
    .createHmac('sha256', requiredEnvironment('BDR_MAGIC_LINK_SECRET'))
    .update(value)
    .digest('base64url');
}

function createSignedToken(payload) {
  const body = encode(payload);
  return `${body}.${signature(body)}`;
}

function readSignedToken(token, expectedPurpose) {
  const [body, providedSignature] = String(token || '').split('.');
  if (!body || !providedSignature) return null;

  const expectedSignature = signature(body);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = decode(body);
    if (
      payload.purpose !== expectedPurpose ||
      typeof payload.email !== 'string' ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt * 1000 < Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function normaliseEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isAllowedContractor(email) {
  const domain = normaliseEmail(email).split('@')[1];
  const allowedDomains = String(process.env.BDR_ALLOWED_EMAIL_DOMAINS || 'gmail.com')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const allowed = String(process.env.BDR_ALLOWED_CONTRACTOR_EMAILS || '')
    .split(',')
    .map(normaliseEmail)
    .filter(Boolean);

  return allowedDomains.includes(domain) && allowed.includes(normaliseEmail(email));
}

export function createMagicLinkToken(email) {
  return createSignedToken({
    email: normaliseEmail(email),
    purpose: 'bdr-magic-link',
    expiresAt: Math.floor(Date.now() / 1000) + MAGIC_LINK_TTL_SECONDS,
  });
}

export function readMagicLinkToken(token) {
  return readSignedToken(token, 'bdr-magic-link');
}

export function createSessionToken(email) {
  return createSignedToken({
    email: normaliseEmail(email),
    purpose: 'bdr-session',
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
}

export function readSessionToken(token) {
  return readSignedToken(token, 'bdr-session');
}

export const sessionMaxAge = SESSION_TTL_SECONDS;
