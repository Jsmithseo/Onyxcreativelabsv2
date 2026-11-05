# Operations staging parity

The BDR and Admin workspaces use the same persistent operations model as the
deployed application: Neon/Postgres for campaigns, leads, activities, and
deals; private Vercel Blob records for contractor access; and signed magic-link
sessions for role selection. Local development must use the same model, not a
mock or browser-only seed store.

## Required non-production resources

Provision these values only in a local `.env.local` or Preview environment;
never commit values or reuse production credentials:

- `DATABASE_URL`: a dedicated Neon branch or separate database with no
  production lead records.
- `BLOB_READ_WRITE_TOKEN`: a dedicated private Blob store/token containing
  only approved non-production contractor records.
- `BDR_MAGIC_LINK_SECRET`: a unique non-production signing secret.
- `BDR_ALLOWED_ADMIN_EMAILS` and `BDR_ALLOWED_CONTRACTOR_EMAILS`: the
  explicitly approved test identities.

An authorized administrator may provision Sierra Robinson's existing
contractor identity and one other existing contractor identity in that
non-production Blob store. Do not create substitute accounts, copy a
production Blob export, or add lead/contact data to production in order to
test this flow.

## Setup and validation

1. Copy `.env.example` to `.env.local` and supply only the non-production
   values above.
2. Run `npm run db:migrate:operations` against the non-production
   `DATABASE_URL`. The migration creates the `campaigns`, `leads`,
   `lead_activities`, and `deals` schema used by both workspaces.
3. Add synthetic, non-personal test leads through the approved non-production
   ingestion path. Do not use `/api/operations/bootstrap` against a
   production-like database as a test shortcut.
   When an authorized migration is needed, its legacy `assignedTo` value is
   retained as the persistent `follow_up_owner_email`; a missing legacy field
   does not clear an existing persistent assignment.
4. With a real Admin session, assign one synthetic lead to Sierra and another
   to the second contractor. Each contractor must have the campaign in their
   existing contractor record before assignment.
5. Sign in through each established contractor identity. Verify each API and
   UI returns only that contractor's explicitly assigned lead. Verify the
   Admin view retains the complete pool and that reassignment survives a page
   reload.

The server is the authorization boundary: contractor requests are filtered by
both campaign membership and `follow_up_owner_email`; a client-side campaign
selector does not grant access. Production continues to require its normal
signed sessions and role allowlists.
