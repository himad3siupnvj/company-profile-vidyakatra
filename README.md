# CMS HIMA D3 Sistem Informasi UPNVJ

Website profil organisasi dan Content Management System untuk HIMA D3 Sistem
Informasi UPN "Veteran" Jakarta, Kabinet Vidyakatra.

Proyek ini menggabungkan situs publik, pengelolaan struktur organisasi,
publikasi berita acara, pengaturan konten, media, dan akun pengurus dalam satu
aplikasi.

## Fitur Utama

### Situs Publik

- Beranda dinamis dengan foto kabinet, video profil, statistik organisasi, dan
  ajakan menuju halaman profil.
- Statistik otomatis berdasarkan anggota, unit kerja, artikel terbit, dan
  periode aktif di database.
- Profil HIMA yang mencakup filosofi kabinet, visi dan misi, pengurus inti,
  departemen, biro, serta divisi.
- Halaman detail untuk setiap unit kerja.
- Daftar berita acara dengan pencarian dan filter kategori.
- Halaman detail berita dengan metadata penulis, waktu baca, gambar, dan
  konten terstruktur.
- Halaman Kontak sebagai pusat kanal media sosial dan kolaborasi.
- Footer, tautan cepat, informasi kontak, dan media sosial yang dikelola dari
  CMS.
- Sitemap dan `robots.txt` dinamis.
- Tampilan responsif untuk desktop dan perangkat seluler.

### Dashboard CMS

- Ringkasan statistik dan aktivitas terbaru.
- Editor Beranda untuk:
  - judul, subjudul, dan tahun banner;
  - unggah dan pratinjau gambar kabinet;
  - video profil;
  - bagian ajakan atau CTA;
  - statistik database dalam mode baca saja.
- Pengelolaan periode kabinet.
- Pengelolaan departemen, biro, divisi, dan anggota.
- Pengelolaan profil, visi, misi, filosofi, dan pimpinan kabinet.
- Pengelolaan informasi kontak, media sosial, tautan footer, dan identitas
  website.
- Ekspor data CMS dalam format CSV dan ZIP.
- Pemeriksaan kondisi autentikasi melalui halaman Auth Health.

### Berita Acara

- Membuat dan mengedit draft berita.
- Mengunggah sumber berita dalam format PDF, DOC, atau DOCX.
- Ekstraksi sumber untuk membantu pembuatan draft.
- Unggah thumbnail dan gambar artikel.
- Kategori, metadata SEO, waktu baca, penulis, unit kerja, dan periode.
- Riwayat versi artikel.
- Workflow publikasi:
  `draft -> submitted -> approved/rejected -> published -> archived`.
- Pembatasan edit berdasarkan pemilik artikel, status, peran, dan hak akses.

### Akun dan Keamanan

- Login CMS menggunakan session JWT dalam cookie HTTP-only.
- Akun CMS selalu terhubung dengan data anggota organisasi.
- Administrator membuat akun dan sistem menghasilkan kode klaim.
- Pengguna menetapkan password sendiri melalui halaman `/claim`.
- Avatar admin menggunakan inisial nama depan tanpa file gambar.
- Role-based access control untuk menu, halaman, dan API.
- Perlindungan agar administrator aktif terakhir tidak dapat dinonaktifkan.
- Rate limiting untuk proses autentikasi.
- Pemeriksaan origin pada request autentikasi sensitif.
- Audit log untuk perubahan penting.
- Validasi file berdasarkan MIME type, ukuran, dan signature file.
- Validasi pengaturan publik dilakukan di UI dan API.

## Peran dan Hak Akses

| Grup | Peran | Cakupan |
| --- | --- | --- |
| Super Admin | Administrator | Akses penuh, akun, role, pengaturan, organisasi, artikel, media, dan ekspor |
| Executive | Ketua, Wakil Ketua | Pengaturan, organisasi, periode, review artikel, media, dan ekspor |
| Reviewer | Koordinator, kepala/wakil departemen atau biro, Kepala Divisi | Membuat, membaca, meninjau, menyetujui, dan menolak artikel |
| Contributor | Sekretaris, Bendahara, Staff | Membuat, mengedit artikel sendiri, submit, dan unggah media |

Daftar permission lengkap berada di [`lib/permissions.ts`](lib/permissions.ts).

## Teknologi

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- PostgreSQL
- Drizzle ORM dan Drizzle Kit
- Supabase Storage
- JWT dan bcrypt
- Vitest
- Playwright

## Persyaratan

- Node.js 22 atau versi LTS yang kompatibel
- pnpm 11
- PostgreSQL atau proyek Supabase
- Bucket Supabase Storage untuk aset CMS

## Konfigurasi Environment

Salin `.env.example` menjadi `.env`, kemudian isi:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vidyakatra_cms"
JWT_SECRET="ganti-dengan-secret-yang-panjang-dan-acak"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SUPABASE_URL="https://project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
SUPABASE_STORAGE_BUCKET="cms-assets"
```

`SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di server dan tidak boleh
diberi prefix `NEXT_PUBLIC_`.

## Menjalankan Proyek

```bash
pnpm install
pnpm db:check
pnpm db:migrate
pnpm dev
```

Aplikasi publik tersedia di `http://localhost:3000`, sedangkan CMS berada di
`http://localhost:3000/x-panel`.

Migrasi hanya membuat struktur database. Administrator pertama perlu
dipersiapkan secara terpisah sebelum akun lain dapat dibuat melalui halaman
Pengelolaan Pengguna.

## Perintah Tersedia

| Perintah | Kegunaan |
| --- | --- |
| `pnpm dev` | Menjalankan development server |
| `pnpm build` | Membuat production build |
| `pnpm start` | Menjalankan production server |
| `pnpm lint` | Menjalankan ESLint |
| `pnpm test` | Menjalankan unit test |
| `pnpm test:coverage` | Menjalankan test dengan laporan coverage |
| `pnpm e2e` | Menjalankan Playwright end-to-end test |
| `pnpm db:check` | Memeriksa konsistensi rantai migrasi |
| `pnpm db:generate` | Membuat migrasi Drizzle |
| `pnpm db:migrate` | Menjalankan migrasi database |
| `pnpm db:studio` | Membuka Drizzle Studio |
| `pnpm verify` | Menjalankan pemeriksaan migrasi, lint, test, TypeScript, dan build |

## Batas Unggah

| Jenis | Format | Batas |
| --- | --- | --- |
| Gambar | JPEG, PNG, WebP, GIF | 1 MB setelah optimasi |
| Sumber berita | PDF, DOC, DOCX | 10 MB |

Gambar yang diunggah melalui editor akan dioptimalkan di browser sebelum
dikirim ke server.

## Struktur Proyek

```text
app/
  (public)/           Halaman situs publik
  api/                Route API publik, autentikasi, dan admin
  x-panel/            Halaman dashboard CMS
components/
  admin/              Komponen dashboard
  public/             Komponen situs publik
  ui/                 Komponen UI dasar
db/
  migrations/         Migrasi PostgreSQL
  schema.ts           Skema Drizzle
lib/                  Auth, permission, cache, storage, dan business logic
tests/                Unit test Vitest
e2e/                  End-to-end test Playwright
docs/                 Catatan deployment, release, dan sprint
```

## Verifikasi Sebelum Rilis

Jalankan:

```bash
pnpm verify
```

Panduan tambahan tersedia di:

- [`docs/deployment-runbook.md`](docs/deployment-runbook.md)
- [`docs/release-checklist.md`](docs/release-checklist.md)
- [`docs/hosting-performance-notes.md`](docs/hosting-performance-notes.md)

