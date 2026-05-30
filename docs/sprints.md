# CMS HIMA D3SI Sprint Plan

## Sprint 1: Security & Permission Foundation

- [x] Align role and permission matrix with `CLAUDE.md`.
- [x] Add reusable password hashing and session helpers.
- [x] Add account claim flow foundations: unclaimed users, claim code, and nullable password hash.
- [x] Add login, logout, current-user, and claim endpoints.
- [x] Add admin login and claim pages.
- [x] Add login-to-dashboard loading animation after successful credential submit.
- [x] Add API permission guards after bootstrap admin flow is ready.
- [x] Push final V1 schema to Supabase and enable RLS policies.

## Sprint 2: Article Workflow Core

- [x] Expand article status to `draft`, `submitted`, `approved`, `published`, `rejected`, and `archived`.
- [x] Add workflow transition helpers and validation.
- [x] Add API actions for submit, approve, reject, archive, and restore.
- [x] Auto-publish after approval when basic validation passes.
- [x] Show valid article actions in the News admin page.

## Sprint 3: Article Editor & Public Rendering

- [x] Make `NotionArticleEditor` reusable for create and edit flows.
- [x] Add PDF/Word source generator that converts berita acara documents into draft article content.
- [x] Add public preview renderer using the same document format.
- [x] Add edit existing article support.
- [x] Centralize slug and read-time utilities.

## Sprint 4: Media & Storage

- [x] Add server-side upload validation for images and PDF source files.
- [x] Integrate Supabase Storage paths for article thumbnails and content images.
- [x] Save uploaded file metadata in `assets`.
- [x] Store uploaded PDF/Word source files for generated berita acara drafts.
- [x] Wire image insertion into the article editor.

Runtime note: upload needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` in the server environment.
Generator note: draft generation supports PDF and DOCX. Legacy `.doc` files should be saved again as DOCX or PDF first.

## Sprint 5: CMS Data Management Hardening

- [x] Complete CRUD for periods, organizational units, divisions, members, and settings.
- [x] Add consistent loading, empty, validation, and error states.
- [x] Use soft delete across important admin data.
- [x] Add backend audit log calls for mutation tracking.
- [x] Add CSV and ZIP export flows.

## Sprint 6: Testing & Production Hardening

- [x] Add unit tests for permissions, workflow transitions, slug generation, and read-time calculation.
- [x] Add API integration smoke tests for create/update validation, workflow update, and soft delete flows.
- [x] Add Playwright E2E for login to published article flow.
- [x] Add middleware enforcement after bootstrap admin is complete.

E2E note: set `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` before running `corepack pnpm e2e`.
