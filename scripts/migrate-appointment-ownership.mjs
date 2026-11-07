import { neon } from '@neondatabase/serverless';
import { writeFile } from 'node:fs/promises';
import { migrateAppointmentOwnership } from '../lib/appointmentOwnership.mjs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = neon(process.env.DATABASE_URL);
const bookings = await sql.query(`SELECT leads.id, leads.stage, leads.follow_up_owner_email,
  activity.id AS activity_id, activity.actor_email, activity.actor_role, activity.created_at
  FROM leads LEFT JOIN lead_activities AS activity ON activity.lead_id = leads.id
    AND activity.activity_type = 'appointment'
    AND (activity.scheduled_for IS NOT NULL OR activity.note ILIKE '%calendly%')
  WHERE activity.id IS NOT NULL OR leads.stage = 'Appointment Set'
  ORDER BY leads.id, activity.created_at, activity.id`);
const apply = process.argv.includes('--apply');
const backupIndex = process.argv.indexOf('--backup');
const backupPath = backupIndex >= 0 ? process.argv[backupIndex + 1] : '';
console.log(JSON.stringify({ mode:apply ? 'apply' : 'preview', bookingRecords:bookings.length,
  affectedLeads:new Set(bookings.map(row => row.id)).size,
  unverifiedOwners:bookings.filter(row => !row.actor_email).length }));
if (apply) {
  if (!backupPath) throw new Error('A private --backup path is required before applying.');
  await writeFile(backupPath, JSON.stringify({ createdAt:new Date().toISOString(), bookings }, null, 2), { mode:0o600, flag:'wx' });
  await migrateAppointmentOwnership(sql);
  const [summary] = await sql.query(`SELECT COUNT(*) FILTER (WHERE booked_at IS NOT NULL)::int AS booked,
    COUNT(*) FILTER (WHERE booked_at IS NOT NULL AND booked_by_email IS NULL)::int AS admin_only
    FROM leads`);
  console.log(JSON.stringify({ migrated:true, ...summary }));
}
