import { neon } from '@neondatabase/serverless';

// Access records belong beside the shared leads. Reading a dashboard must not
// consume the Blob allowance required to identify its contractors.
export const workspaceMetadataSchema = `
  CREATE TABLE IF NOT EXISTS workspace_metadata (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

let client;
function database() {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error('Workspace database is not configured.');
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

function rows(result) {
  return Array.isArray(result) ? result : result.rows;
}

export function createWorkspaceMetadataStore(sql) {
  return {
    async read(key) {
      const result = await sql.query('SELECT value FROM workspace_metadata WHERE key = $1', [key]);
      return rows(result)[0]?.value ?? null;
    },
    async list(prefix) {
      const result = await sql.query('SELECT key, value FROM workspace_metadata WHERE starts_with(key, $1) ORDER BY key', [prefix]);
      return rows(result);
    },
    async write(key, value) {
      await sql.query(`INSERT INTO workspace_metadata (key, value) VALUES ($1, $2::jsonb)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`, [key, JSON.stringify(value)]);
      return value;
    },
  };
}

export const readWorkspaceMetadata = (key) => createWorkspaceMetadataStore(database()).read(key);
export const listWorkspaceMetadata = (prefix) => createWorkspaceMetadataStore(database()).list(prefix);
export const writeWorkspaceMetadata = (key, value) => createWorkspaceMetadataStore(database()).write(key, value);
