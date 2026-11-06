import crypto from 'crypto';
import { readWorkspaceMetadata, listWorkspaceMetadata, writeWorkspaceMetadata } from './workspaceMetadata.mjs';
import { isAllowedContractor, normaliseEmail } from './bdrAuth';

const CONTRACTOR_PREFIX = 'contractors/';
const DEFAULT_DAILY_CALL_GOAL = 120;
const DEFAULT_DAILY_APPOINTMENT_GOAL = 3;

function goalValue(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

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
    dailyCallGoal: goalValue(value.dailyCallGoal, DEFAULT_DAILY_CALL_GOAL),
    dailyAppointmentGoal: goalValue(
      value.dailyAppointmentGoal,
      DEFAULT_DAILY_APPOINTMENT_GOAL
    ),
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
  const value = await readWorkspaceMetadata(contractorPath(email));
  if (!value) return null;
  const contractor = parseContractor(value);
  if (!contractor) throw new Error('Contractor record is invalid.');
  return { contractor };
}

async function writeContractor(contractor) {
  await writeWorkspaceMetadata(contractorPath(contractor.email), contractor);
  return contractor;
}

export async function listContractors() {
  const records = await listWorkspaceMetadata(CONTRACTOR_PREFIX);
  const contractors = records.map(({ value }) => {
    const contractor = parseContractor(value);
    if (!contractor) throw new Error('Contractor record is invalid.');
    return contractor;
  });
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
  dailyCallGoal,
  dailyAppointmentGoal,
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
    dailyCallGoal: goalValue(
      dailyCallGoal,
      existing?.contractor.dailyCallGoal ?? DEFAULT_DAILY_CALL_GOAL
    ),
    dailyAppointmentGoal: goalValue(
      dailyAppointmentGoal,
      existing?.contractor.dailyAppointmentGoal ?? DEFAULT_DAILY_APPOINTMENT_GOAL
    ),
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
