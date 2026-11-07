export const appointmentOwnershipStatements = [
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS booked_by_email TEXT,
    ADD COLUMN IF NOT EXISTS booked_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS leads_booking_owner_idx ON leads (campaign_id, booked_by_email)
    WHERE booked_at IS NOT NULL`,
  `WITH first_booking AS (
    SELECT DISTINCT ON (lead_id) lead_id, LOWER(TRIM(actor_email)) AS owner_email, created_at
    FROM lead_activities
    WHERE activity_type = 'appointment'
      AND (scheduled_for IS NOT NULL OR note ILIKE '%calendly%')
    ORDER BY lead_id, created_at, id
  )
  UPDATE leads SET booked_by_email = NULLIF(first_booking.owner_email, ''),
    booked_at = first_booking.created_at
  FROM first_booking WHERE leads.id = first_booking.lead_id AND leads.booked_at IS NULL`,
  // An imported booked stage without a booking record has no proven owner.
  // Keep it with Admin until the original booking can be established.
  `UPDATE leads SET booked_at = updated_at
    WHERE stage = 'Appointment Set' AND booked_at IS NULL`,
];

export async function migrateAppointmentOwnership(sql) {
  return sql.transaction(appointmentOwnershipStatements.map(statement => sql.query(statement)));
}
