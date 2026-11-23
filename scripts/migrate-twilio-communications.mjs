import { neon } from '@neondatabase/serverless';
import { twilioCommunicationsSchema } from '../lib/twilioCommunicationsSchema.mjs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = neon(process.env.DATABASE_URL);
await sql.transaction(twilioCommunicationsSchema.map((statement) => sql.query(statement)));
console.log('Twilio call authorization, recording library, and text history tables are ready.');
