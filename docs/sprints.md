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

## Backlog: Production Auth Operations

- [x] Add admin reset-password flow for claimed users.
- [ ] Add forgot-password or reset-token flow for users who cannot access their account.
- [x] Ensure reset-claim operations move users back to `unclaimed` state before re-claim.
- [x] Improve claim/login error messages for production debugging without exposing sensitive details.
- [ ] Add an admin-facing auth health/debug view for production configuration checks.

## Backlog: Role-Aware Admin UX

- [ ] Load current user profile in admin layout/header instead of hardcoded Super Admin data.
- [ ] Filter sidebar navigation and quick actions based on role permissions.
- [ ] Adapt dashboard cards, review queues, and shortcuts to each role group.
- [ ] Hide or disable UI actions that the current role cannot perform.
- [ ] Add route-level admin page guards so users cannot open pages outside their permissions.
- [ ] Add tests for role-based navigation and dashboard visibility.

## Backlog: Quality & Finishing

- [ ] Polish the article modal/editor UX, especially image blocks and Notion-like controls.
- [ ] Polish public berita acara detail layout into a cleaner press-release style template.
- [ ] Improve PDF/DOCX generated article structure: title detection, paragraph cleanup, page marker removal, and berita acara formatting.
- [ ] Decide whether to support legacy `.doc` files or keep requiring DOCX/PDF conversion.
- [ ] Replace admin fallback dummy data with strict loading, empty, and error states for production.
- [ ] Connect dashboard cards and editorial queues to real database aggregates.
- [ ] Run manual QA with real users for login, generate, edit, publish, public article rendering, image upload, and export flows.

## Backlog: Media Optimization

- [ ] Use structured Supabase Storage object paths: `{year}/{section}/{category}/{kind}/{uuid}-{filename}`.
- [ ] Route uploads into context-aware folders, for example `2026/articles/berita/cover` and `2026/profile/leaders/photo`.
- [ ] Auto-compress uploaded images before sending to Supabase Storage.
- [ ] Convert supported uploaded images to WebP for public article assets.
- [ ] Resize article cover/content images to safe maximum dimensions.
- [ ] Show upload progress states for compressing and uploading.
- [ ] Keep PDF/DOCX source files as generate-only inputs unless persistent source storage is explicitly needed.

## Backlog: Public Performance & Hosting

- [ ] Replace public SSR for `/berita` and `/berita/[slug]` with ISR where possible.
- [ ] Add `revalidate` windows for public pages such as home, articles, agenda, profile, and gallery.
- [ ] Add cache invalidation or revalidation strategy after admin content mutations.
- [ ] Keep admin CMS routes dynamic/client-driven while public pages use cached rendering.
- [ ] Avoid database reads on every public visitor request unless the page truly needs fresh data.
- [ ] Store public media URLs in the database as Supabase Storage object URLs, never base64.
- [ ] Store external video URLs, such as YouTube embeds, instead of uploading videos to Supabase Storage.
- [ ] Review Vercel/Supabase limits after user testing and tune caching, image sizes, and query volume.

## Backlog: Content Completion Agenda

- [ ] List hardcoded and missing public images that need real uploads.
- [ ] Upload and replace hardcoded article, profile, and public page images after the related CMS support is ready.
- [ ] Complete image assets that are currently placeholders or missing.
- [ ] Store completed images in structured Supabase Storage paths based on year, section, and category.

## Backlog: Theme Support

- [ ] Add light theme support as a final polish pass after core CMS flows are stable.

## Backlog: Profile CMS

- [ ] Add dashboard editor for `/profil` page content.
- [ ] Make cabinet intro, philosophy, vision, mission, and core values editable from CMS.
- [ ] Add CMS editing for pengurus inti content: ketua, wakil ketua, koordinator, sekretaris, and bendahara.
- [ ] Add CMS editing for department/biro profile pages shown at `/profil/[slug]`.
- [ ] Connect `/x-panel/vision-mission` to API and database-backed settings.
- [ ] Replace hardcoded profile data in `lib/public-content.ts` and public profile routes with database-backed content and safe fallback.
