# Hosting Performance Notes

## Public Rendering

- `/`, `/berita`, and `/berita/[slug]` use a 5 minute revalidate window because they read public article data.
- `/profil`, `/profil/[slug]`, and `/kontak` use a 1 hour revalidate window because their content is mostly static until Cabinets CMS updates it.
- Public article database reads are wrapped in a tagged cache using `public:articles`, so normal visitor traffic reuses cached data instead of querying the database on every request.

## Cache Invalidation

Admin article mutations call `revalidateTag("public:articles", "max")` after:

- article create/update/delete
- workflow status changes such as submit, approve, reject, archive, and restore
- generated draft creation

This keeps public article pages cached for visitors while allowing admin changes to invalidate the article cache.

## Admin Routes

Admin CMS pages stay client-driven behind `/x-panel`. API routes remain dynamic and permission guarded. The public cache strategy should not be applied to admin dashboards, user management, article editing, or settings screens.

## Media And External URLs

- Uploaded images are stored in Supabase Storage and persisted as public object URLs.
- Public video embeds use external URLs such as YouTube, not Supabase uploads.
- Large public images should be compressed/resized before upload once the media optimization backlog is implemented.

## Limits To Revisit After User Testing

Initial settings are conservative for the current CMS size. Revisit after real traffic/content testing:

- Public page revalidate windows if articles change more frequently than expected.
- Supabase read volume after dashboard aggregates and Cabinets CMS are connected.
- Storage usage after replacing hardcoded profile/article images with uploaded assets.
- Image size and format tuning after WebP conversion/resizing is implemented.
