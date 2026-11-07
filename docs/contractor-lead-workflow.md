# Contractor lead workflow

Admin supplies campaign leads. Contractor CSV uploads are removed from the BDR
workspace and the old endpoint returns HTTP 410.

Contractors assigned to a campaign share its unbooked prospects and call history.
Each caller has their own queue progress and callback dates. Scripts use the
authenticated contractor profile's first name, including copied scripts.

A confirmed appointment atomically records `leads.booked_by_email` and `booked_at`.
Only the booking contractor and Admin can then read the lead, its history, or its
appointment. The lead leaves prospecting queues. This rule is enforced by the
workspace, detail, history, appointments, dashboard, and activity APIs. Campaign
access is still required; ownership alone does not grant campaign access.

The booking contractor has a read-only opportunity view. Admin conducts the
meeting and presentation and manages the sales stages. Contractor calls and
new bookings are rejected once the lead has been booked. Admin stage changes do
not release booking privacy or change the booking owner.

Before releasing code that requires these columns, preview and apply
`scripts/migrate-appointment-ownership.mjs` using the linked database environment.
Application requires `--apply --backup /absolute/private/backup.json`. It preserves
existing bookings using the first confirmed booking actor. Imported appointment
stages without a proven booking owner remain Admin-only. The migration is
idempotent, and the normal shared-operations migration also includes it.
