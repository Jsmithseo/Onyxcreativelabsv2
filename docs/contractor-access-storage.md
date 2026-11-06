# Contractor access storage

Contractor profiles and admin dashboard settings use `workspace_metadata` in the
existing shared operations Postgres database. API authentication, campaign
permissions, lead ownership, goals, and activity reporting use the same existing
contractor records. No client receives database credentials.

The previous private Blob store reached its read allowance and returned 403 for
contractor records, which prevented contractor workspaces and admin reports from
loading. Normal roster and settings reads no longer use Blob.

Before deploying this change to another environment, recover its existing Blob
records into its database:

```sh
npm run db:migrate:metadata -- /absolute/private/path/new-backup.json
```

The command requires `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` in `.env.local`.
It reads and validates every contractor before making database changes, writes a
private backup, and imports in one transaction. An inaccessible source stops the
migration. Re-running it does not overwrite newer database records. It does not
send invitations, change roles, or modify leads or call history. Existing Blob
records remain intact. Keep backups outside the repository and deployment.

Once the database is in use, contractor edits are stored there. An older Blob
deployment would read the old roster; retain the database-backed implementation
when rolling back unrelated changes.
