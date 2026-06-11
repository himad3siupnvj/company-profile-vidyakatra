# V1 Release Checklist

## Automated

- [ ] `npm run verify` passes.
- [ ] `npm audit` reports no known vulnerabilities.
- [ ] Publish-flow Playwright E2E passes against the release environment.
- [ ] Migration SQL and snapshots are committed together.

## Data And Configuration

- [ ] Exactly one organization period is active.
- [ ] Production admin account and claim flow are verified.
- [ ] Storage bucket permissions and public URLs are verified.
- [ ] Database backup is available before migration.

## Manual Product QA

- [ ] Login, logout, claim account, reset claim, and reset password.
- [ ] Create, edit, submit, reject, approve, archive, and restore article.
- [ ] Article history shows snapshots before edit and publish.
- [ ] Public pages and APIs show only active-period, published, non-deleted data.
- [ ] Member, unit, division, cabinet, media, settings, CSV, and ZIP flows.
- [ ] Keyboard navigation, visible focus, labels, image alt text, mobile layout, and empty/error states.

## Content

- [ ] Replace placeholder article and organization images listed in `docs/public-image-inventory.md`.
- [ ] Review public copy, contact links, SEO metadata, and social preview images.
