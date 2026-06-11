import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { siteSettings } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import { officialSocialUrls } from "@/lib/social-links"
import { revalidateTag } from "next/cache"
import { publicCacheTags } from "@/lib/cache-tags"

export const runtime = "nodejs"

const defaultSettings = {
  contactInfo: {
    email: "himpunand3si@gmail.com",
    phone: "+62 812 3456 7890",
    whatsapp: "+62 812 3456 7890",
    address: "Jl. R.S. Fatmawati No.1, Pondok Labu\nKec. Cilandak, Kota Jakarta Selatan\nDKI Jakarta 12450",
  },
  socialMedia: {
    ...officialSocialUrls,
  },
  footerSettings: {
    showSocialMedia: true,
    showContactInfo: true,
    showQuickLinks: true,
    showNewsletter: false,
    copyrightText: "© 2026 HIMA D3 Sistem Informasi UPNVJ. Kabinet Vidyakatra.",
  },
  quickLinks: [
    { id: 1, label: "Beranda", url: "/", enabled: true },
    { id: 2, label: "Profil", url: "/profil", enabled: true },
    { id: 3, label: "Struktur Organisasi", url: "/profil#struktur", enabled: true },
    { id: 4, label: "Berita Acara", url: "/berita", enabled: true },
    { id: 5, label: "Kolaborasi", url: "/kontak", enabled: true },
  ],
  siteSettings: {
    siteName: "HIMA D3 Sistem Informasi UPNVJ",
    siteDescription: "Website resmi Himpunan Mahasiswa D3 Sistem Informasi UPNVJ Kabinet Vidyakatra",
    maintenanceMode: false,
    analyticsEnabled: true,
  },
}

export async function GET() {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const rows = await db.select().from(siteSettings)
  const settings = { ...defaultSettings } as Record<string, unknown>

  for (const row of rows) {
    settings[row.key] = row.value
  }

  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const db = getDb()
  const now = new Date()

  await Promise.all(
    Object.entries(payload)
      .filter(([key]) => key in defaultSettings)
      .map(([key, value]) =>
        db
          .insert(siteSettings)
          .values({ key, value, updatedAt: now })
          .onConflictDoUpdate({
            target: siteSettings.key,
            set: { value, updatedAt: now },
          })
      )
  )

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "settings.update",
    entityType: "site_settings",
    metadata: {
      keys: Object.keys(payload).filter((key) => key in defaultSettings),
    },
  })

  revalidateTag(publicCacheTags.settings, "max")

  return NextResponse.json({ ok: true })
}
