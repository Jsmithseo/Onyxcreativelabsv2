import crypto from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { get, list } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { workspaceMetadataSchema } from '../lib/workspaceMetadata.mjs';

// Read every record before changing the destination. A suspension, failed read,
// or invalid record must stop recovery instead of producing an empty roster.
export async function collectWorkspaceMetadata({ listBlobs = list, readBlob = get } = {}) {
  const records = [];
  let cursor;
  do {
    const page = await listBlobs({ prefix: 'contractors/', cursor, limit: 100 });
    for (const blob of page.blobs) {
      const result = await readBlob(blob.pathname, { access: 'private', useCache: false });
      if (result?.statusCode !== 200) throw new Error('A contractor record could not be recovered.');
      const value = JSON.parse(await new Response(result.stream).text());
      const email = String(value?.email || '').trim().toLowerCase();
      const expectedKey = `contractors/${crypto.createHash('sha256').update(email).digest('hex')}.json`;
      if (!email || expectedKey !== blob.pathname || !Array.isArray(value.campaigns)) {
        throw new Error('A contractor record is invalid; migration stopped.');
      }
      records.push({ key: blob.pathname, value });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const settings = await readBlob('admin/dashboard-settings.json', { access: 'private', useCache: false });
  if (settings) {
    if (settings.statusCode !== 200) throw new Error('Dashboard settings could not be recovered.');
    records.push({ key: 'admin/dashboard-settings.json', value: JSON.parse(await new Response(settings.stream).text()) });
  }
  return records;
}

export async function importWorkspaceMetadata(sql, records) {
  // Re-running recovery cannot replace newer edits made in the live database.
  await sql.transaction([
    sql.query(workspaceMetadataSchema),
    ...records.map(({ key, value }) => sql.query(
      'INSERT INTO workspace_metadata (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING',
      [key, JSON.stringify(value)]
    )),
  ]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const backupPath = process.argv[2];
  if (!process.env.DATABASE_URL || !backupPath) throw new Error('DATABASE_URL and a new private backup file path are required.');
  const records = await collectWorkspaceMetadata();
  if (!records.some(({ key }) => key.startsWith('contractors/'))) throw new Error('No contractors recovered; migration stopped.');
  await writeFile(backupPath, JSON.stringify({ recoveredAt: new Date().toISOString(), records }, null, 2), { flag: 'wx', mode: 0o600 });
  await importWorkspaceMetadata(neon(process.env.DATABASE_URL), records);
  console.log(JSON.stringify({ recoveredContractors: records.filter(({ key }) => key.startsWith('contractors/')).length, settingsRecovered: records.some(({ key }) => key === 'admin/dashboard-settings.json') }));
}
