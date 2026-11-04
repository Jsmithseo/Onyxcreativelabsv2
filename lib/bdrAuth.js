import crypto from 'crypto';

const MAGIC_LINK_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const roles = new Set(['contractor', 'admin']);

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

function requireRole(role) {
  if (!roles.has(role)) throw new Error('Unknown access role');
  return role;
}

function allowedEmails(environmentVariable) {
  return String(process.env[environmentVariable] || '')
    .split(',')
    .map(normaliseEmail)
    .filter(Boolean);
}

function hasAllowedDomain(email) {
  const domain = normaliseEmail(email).split('@')[1];
  const allowedDomains = String(
    process.env.BDR_ALLOWED_EMAIL_DOMAINS || 'gmail.com'
  )
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowedDomains.includes(domain);
}

function readSignedToken(token, expectedPurpose) {
  const [body, providedSignature] = String(token || '').split('.');
  if (!body || !providedSignature) return null;

  const expectedSignature = signature(body);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(provided, expected)
  ) {
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
  return String(email || '')
    .trim()
    .toLowerCase();
}

export function isAllowedContractor(email) {
  return (
    hasAllowedDomain(email) &&
    allowedEmails('BDR_ALLOWED_CONTRACTOR_EMAILS').includes(
      normaliseEmail(email)
    )
  );
}

export function isAllowedAdmin(email) {
  return (
    hasAllowedDomain(email) &&
    allowedEmails('BDR_ALLOWED_ADMIN_EMAILS').includes(normaliseEmail(email))
  );
}

export function safeBdrReturnTo(value) {
  const returnTo = String(value || '');
  return returnTo.startsWith('/bdr') && !returnTo.startsWith('//')
    ? returnTo.slice(0, 1200)
    : '';
}

export function createMagicLinkToken(email, role = 'contractor', options = {}) {
  requireRole(role);
  return createSignedToken({
    email: normaliseEmail(email),
    purpose: `${role}-magic-link`,
    role,
    ...(role === 'contractor' && safeBdrReturnTo(options.returnTo)
      ? { returnTo: safeBdrReturnTo(options.returnTo) }
      : {}),
    expiresAt: Math.floor(Date.now() / 1000) + MAGIC_LINK_TTL_SECONDS,
  });
}

export function readMagicLinkToken(token, role = 'contractor') {
  requireRole(role);
  const claim = readSignedToken(token, `${role}-magic-link`);
  return claim?.role === role ? claim : null;
}

export function createSessionToken(email, role = 'contractor') {
  requireRole(role);
  return createSignedToken({
    email: normaliseEmail(email),
    purpose: `${role}-session`,
    role,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
}

export function readSessionToken(token, role = 'contractor') {
  requireRole(role);
  const claim = readSignedToken(token, `${role}-session`);
  return claim?.role === role ? claim : null;
}

export const sessionMaxAge = SESSION_TTL_SECONDS;
