# CMS HIMA D3SI Sprint Plan

## Sprint 1: Security & Permission Foundation

- Align role and permission matrix with `CLAUDE.md`.
- Add reusable password hashing and session helpers.
- Add account claim flow foundations: unclaimed users, claim code, and nullable password hash.
- Add login, logout, current-user, and claim endpoints.
- Add admin login and claim pages.
- Add API permission guards after bootstrap admin flow is ready.

## Sprint 2: Article Workflow Core

- Expand article status to `draft`, `submitted`, `approved`, `published`, `rejected`, and `archived`.
- Add workflow transition helpers and validation.
- Add API actions for submit, approve, reject, archive, and restore.
- Auto-publish after approval when basic validation passes.
- Show valid article actions in the News admin page.

## Sprint 3: Article Editor & Public Rendering

- Make `NotionArticleEditor` reusable for create and edit flows.
- Add public preview renderer using the same document format.
- Add edit existing article support.
- Centralize slug and read-time utilities.

## Sprint 4: Media & Storage

- Add server-side upload validation for images and PDF source files.
- Integrate Supabase Storage paths for article thumbnails and content images.
- Save uploaded file metadata in `assets`.
- Wire image insertion into the article editor.

## Sprint 5: CMS Data Management Hardening

- Complete CRUD for periods, organizational units, divisions, members, and settings.
- Add consistent loading, empty, validation, and error states.
- Use soft delete across important admin data.
- Add backend audit log calls for mutation tracking.
- Add CSV and ZIP export flows.

## Sprint 6: Testing & Production Hardening

- Add unit tests for permissions, workflow transitions, slug generation, and read-time calculation.
- Add API integration tests for create/update/workflow/delete flows.
- Add Playwright E2E for login to published article flow.
- Add middleware enforcement after bootstrap admin is complete.
