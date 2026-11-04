import crypto from 'crypto';
import { get, list, put } from '@vercel/blob';
import { isAllowedContractor, normaliseEmail } from './bdrAuth';

const CONTRACTOR_PREFIX = 'contractors/';

function contractorPath(email) {
  const digest = crypto
    .createHash('sha256')
    .update(normaliseEmail(email))
    .digest('hex');
  return `${CONTRACTOR_PREFIX}${digest}.json`;
}

function parseContractor(value) {
  if (!value || typeof value !== 'object') return null;
  const email = normaliseEmail(value.email);
  if (!email) return null;

  return {
    id: String(value.id || `contractor-${crypto.randomUUID()}`),
    name: String(value.name || '').trim(),
    email,
    phone: String(value.phone || '').trim(),
    notes: String(value.notes || '').trim(),
    campaigns: Array.isArray(value.campaigns)
      ? value.campaigns.map(String).filter(Boolean)
      : [],
    status: value.status === 'invite_failed' ? 'invite_failed' : 'invited',
    createdAt: Number(value.createdAt) || Date.now(),
    invitedAt: Number(value.invitedAt) || null,
    invitedBy: normaliseEmail(value.invitedBy),
  };
}

async function readContractorRecord(email) {
  const result = await get(contractorPath(email), {
    access: 'private',
    useCache: false,
  });
  if (!result || result.statusCode !== 200) return null;

  try {
    const contractor = parseContractor(
      JSON.parse(await new Response(result.stream).text())
    );
    return contractor ? { contractor, etag: result.blob.etag } : null;
  } catch {
    return null;
  }
}

async function writeContractor(contractor) {
  await put(contractorPath(contractor.email), JSON.stringify(contractor), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: 'application/json',
  });
  return contractor;
}

export async function listContractors() {
  const contractors = [];
  let cursor;

  do {
    const page = await list({ prefix: CONTRACTOR_PREFIX, cursor, limit: 100 });
    const records = await Promise.all(
      page.blobs.map(async (blob) => {
        const result = await get(blob.pathname, {
          access: 'private',
          useCache: false,
        });
        if (!result || result.statusCode !== 200) return null;
        try {
          return parseContractor(
            JSON.parse(await new Response(result.stream).text())
          );
        } catch {
          return null;
        }
      })
    );
    contractors.push(...records.filter(Boolean));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return contractors.sort((a, b) => b.createdAt - a.createdAt);
}

export async function findContractor(email) {
  const record = await readContractorRecord(email);
  return record?.contractor || null;
}

export async function saveContractor({
  name,
  email,
  phone,
  notes,
  campaigns,
  invitedBy,
  sendInvitation = true,
}) {
  const existing = await readContractorRecord(email);
  const contractor = {
    id: existing?.contractor.id || `contractor-${crypto.randomUUID()}`,
    name: String(name || '').trim(),
    email: normaliseEmail(email),
    phone: String(phone || '').trim(),
    notes: String(notes ?? existing?.contractor.notes ?? '').trim(),
    campaigns: Array.isArray(campaigns)
      ? [...new Set(campaigns.map(String).filter(Boolean))]
      : [],
    status: sendInvitation ? 'invited' : existing?.contractor.status || 'invited',
    createdAt: existing?.contractor.createdAt || Date.now(),
    invitedAt: sendInvitation ? Date.now() : existing?.contractor.invitedAt || null,
    invitedBy: normaliseEmail(invitedBy || existing?.contractor.invitedBy),
  };
  return writeContractor(contractor);
}

export async function markInvitationFailed(email) {
  const record = await readContractorRecord(email);
  if (!record) return null;
  return writeContractor({
    ...record.contractor,
    status: 'invite_failed',
  });
}

export async function isActiveContractor(email) {
  if (isAllowedContractor(email)) return true;
  return Boolean(await findContractor(email));
}
