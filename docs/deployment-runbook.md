# Deployment Runbook

## Before Deploy

1. Set production environment variables, especially `DATABASE_URL`, auth secrets, and Supabase Storage credentials.
2. Run `npm ci`.
3. Run `npm run verify`.
4. Review every new file in `db/migrations` and confirm the journal is committed with it.
5. Take a database backup before applying a migration that changes existing data.

## Database Migration

For a database already managed by this repository:

```bash
npm run db:migrate
```

Do not run `db:push` against production. If an older production database predates the Drizzle migration journal, baseline its existing schema first in a controlled maintenance window. Do not mark historical migrations as applied until their schema is verified manually.

Migration `0003_odd_ender_wiggin` creates article version history and backfills null period references to the current active period. Confirm exactly one period is active before applying it.

## Deploy And Smoke Test

1. Deploy the application after the migration succeeds.
2. Verify login and role-restricted admin navigation.
3. Create, edit, submit, approve, and open a public article.
4. Open article version history and confirm pre-edit and pre-publish snapshots exist.
5. Verify `/api/articles`, `/api/articles/featured`, `/api/members`, `/api/organizational-units`, and `/api/divisions`.
6. Upload an image and download CSV and ZIP exports.
7. Check server logs and the audit log for unexpected errors.

## Rollback

Application rollback is done by redeploying the previous known-good commit. Database migrations are forward-only by default; restore the pre-deploy backup if a schema/data rollback is required.
