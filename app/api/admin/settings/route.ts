import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import { officialSocialUrls } from "@/lib/social-links"
import { revalidateTag } from "next/cache"
import { publicCacheTags } from "@/lib/cache-tags"
import { defaultHomeContent } from "@/lib/home-content"
import { validateHomeContent, validatePublicSettings } from "@/lib/settings-validation"

export const runtime = "nodejs"

const defaultSettings = {
  contactInfo: {
    email: "himpunand3si@gmail.com",
    phone: "",
    whatsapp: "",
    address: "Jl. R.S. Fatmawati No.1, Pondok Labu\nKec. Cilandak, Kota Jakarta Selatan\nDKI Jakarta 12450",
    officeHours: "Senin - Jumat, 08.00 - 19.00 WIB",
  },
  socialMedia: {
    ...officialSocialUrls,
  },
  footerSettings: {
    showSocialMedia: true,
    showContactInfo: true,
    showQuickLinks: true,
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
  homeContent: defaultHomeContent,
}

export async function GET() {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.siteSettings)
    .get()
  const rows = snapshot.docs.map((document) => document.data())
  const settings = { ...defaultSettings } as Record<string, unknown>

  for (const row of rows) {
    const fallback = defaultSettings[row.key as keyof typeof defaultSettings]
    settings[row.key] =
      fallback &&
      typeof fallback === "object" &&
      !Array.isArray(fallback) &&
      row.value &&
      typeof row.value === "object" &&
      !Array.isArray(row.value)
        ? { ...fallback, ...row.value }
        : row.value
  }

  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  if (payload.homeContent) {
    const error = validateHomeContent(payload.homeContent)
    if (error) return NextResponse.json({ error }, { status: 400 })
  }
  if (
    payload.contactInfo ||
    payload.socialMedia ||
    payload.footerSettings ||
    payload.quickLinks ||
    payload.siteSettings
  ) {
    const error = validatePublicSettings({
      contactInfo: payload.contactInfo ?? defaultSettings.contactInfo,
      socialMedia: payload.socialMedia ?? defaultSettings.socialMedia,
      footerSettings: payload.footerSettings ?? defaultSettings.footerSettings,
      quickLinks: payload.quickLinks ?? defaultSettings.quickLinks,
      siteSettings: payload.siteSettings ?? defaultSettings.siteSettings,
    })
    if (error) return NextResponse.json({ error }, { status: 400 })
  }
  const db = getFirestoreDb()
  const now = new Date()

  await Promise.all(
    Object.entries(payload)
      .filter(([key]) => key in defaultSettings)
      .map(async ([key, value]) => {
        const existing = await db
          .collection(firestoreCollections.siteSettings)
          .where("key", "==", key)
          .limit(1)
          .get()
        const reference =
          existing.docs[0]?.ref ?? db.collection(firestoreCollections.siteSettings).doc()
        await reference.set({ key, value, updatedAt: now }, { merge: true })
      }),
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
