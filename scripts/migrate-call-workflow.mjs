import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = neon(process.env.DATABASE_URL);
// Expand the existing stage validation without changing any lead or activity.
// Keep this separate from the initial migration, which also seeds campaigns.
await sql.transaction([
  sql.query('ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_stage_check'),
  sql.query("ALTER TABLE leads ADD CONSTRAINT leads_stage_check CHECK (stage IN ('New', 'Contacted', 'Qualified', 'Appointment Set', 'Pitched', 'Won', 'Lost', 'Do Not Call'))"),
  sql.query("INSERT INTO operations_schema_migrations(id) VALUES ('call-workflow-v1') ON CONFLICT (id) DO NOTHING"),
]);
console.log('Call workflow stage validation is ready. No lead records were changed.');
