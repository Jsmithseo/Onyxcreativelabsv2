import { randomUUID } from 'node:crypto';
import { listNewestWorkspaceMetadata, writeWorkspaceMetadata } from './workspaceMetadata.mjs';

const INQUIRY_PREFIX = 'website-inquiry:';
const PAGE_SIZE = 25;

export async function saveUndeliveredInquiry(lead) {
  const receivedAt = new Date().toISOString();
  await writeWorkspaceMetadata(`${INQUIRY_PREFIX}${receivedAt}:${randomUUID()}`, { ...lead, receivedAt });
}

export async function listUndeliveredInquiries(before) {
  const cursor = typeof before === 'string' && before.startsWith(INQUIRY_PREFIX) && before.length < 100
    ? before
    : null;
  const records = await listNewestWorkspaceMetadata(INQUIRY_PREFIX, PAGE_SIZE + 1, cursor);
  return {
    inquiries: records.slice(0, PAGE_SIZE).map(({ key, value }) => ({ ...value, id: key })),
    next: records.length > PAGE_SIZE ? records[PAGE_SIZE - 1].key : null,
  };
}
