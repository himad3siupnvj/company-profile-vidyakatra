# Public Image Inventory

This inventory tracks hardcoded, placeholder, and missing public-facing images that should eventually be uploaded through CMS/Supabase Storage.

## Needs Real CMS Uploads

| Area | Current source | Usage | Suggested storage target |
| --- | --- | --- | --- |
| Public news fallback articles | `lib/public-content.ts` Unsplash URLs | Curated fallback news list when database has no published articles | `2026/articles/{category}/cover` |
| Public news default cover | `public/news/default.jpg` | Article fallback when `thumbnailUrl` is empty | `2026/articles/default/cover` |
| Work unit member portraits | `lib/public-content.ts` `portraitA` to `portraitD` Unsplash URLs | Placeholder portraits on `/profil/[slug]` | `2026/profile/units/members/photo` |
| Home hero photo | `assets/kabinet.jpg` | Public home hero/team image | `2026/home/hero/photo` |
| Cabinet lead photos | `assets/lead/*.jpg` | Ketua/Wakil profile photos on `/profil` | `2026/profile/leaders/photo` |
| Organization unit logos | `assets/organ/*.png` | Public profile department/biro logos | `2026/profile/units/logo` |
| HIMA and cabinet logos | `assets/hima.png`, `assets/logoKabinet.png` | Navbar, footer, admin sidebar, profile page | `2026/brand/logo` |

## Missing Or Placeholder Paths

| Path | Usage | Current status |
| --- | --- | --- |
| `/hero-bg.jpg` | Admin home page editor fallback value | Missing from `public/` |
| `/about-image.jpg` | Admin home page editor fallback value | Missing from `public/` |
| `/placeholder-avatar.jpg` | Admin header avatar image | Missing from `public/`; `public/placeholder-user.jpg` exists |
| `/avatars/{id}.jpg` | Admin recent activity avatars | Missing unless avatar files are added |
| `public/placeholder*.{jpg,png,svg}` | Generic placeholders | Should not be used as final public content |

## Already Using External URLs Correctly

| Area | Current source | Note |
| --- | --- | --- |
| Company profile video | YouTube embed in `app/(public)/page.tsx` | Keep as external video URL; do not upload video to Supabase Storage |
| Social media links | YouTube/Instagram/LinkedIn/TikTok URLs | Stored/edited as external URLs in settings |

## Follow-Up

- Replace hardcoded public article and profile images after Cabinets CMS and dashboard content support are ready.
- Prefer Supabase Storage public object URLs for images persisted in article/profile records.
- Keep external video embeds as URLs rather than uploaded media files.
