import { unstable_cache } from "next/cache"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { publicCacheTags } from "@/lib/cache-tags"
import { officialSocialUrls, type SocialMediaUrls } from "@/lib/social-links"
import {
  defaultHomeContent,
  type PublicHomeContent,
} from "@/lib/home-content"

export { defaultHomeContent, type PublicHomeContent } from "@/lib/home-content"

export type PublicSocialMedia = SocialMediaUrls
export type PublicContactInfo = {
  email: string
  phone: string
  whatsapp: string
  address: string
  officeHours: string
}
export type PublicFooterSettings = {
  showSocialMedia: boolean
  showContactInfo: boolean
  showQuickLinks: boolean
  copyrightText: string
}
export type PublicQuickLink = {
  id: string | number
  label: string
  url: string
  enabled: boolean
}
const defaults = {
  socialMedia: officialSocialUrls,
  contactInfo: {
    email: "himpunand3si@gmail.com",
    phone: "",
    whatsapp: "",
    address:
      "Jl. R.S. Fatmawati No.1, Pondok Labu, Kec. Cilandak, Kota Jakarta Selatan, DKI Jakarta 12450",
    officeHours: "Senin - Jumat, 08.00 - 19.00 WIB",
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
    { id: 3, label: "Berita Acara", url: "/berita", enabled: true },
    { id: 4, label: "Kolaborasi", url: "/kontak", enabled: true },
  ],
  homeContent: defaultHomeContent,
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}
function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback
}

function normalizeHomeContent(value: unknown): PublicHomeContent {
  const candidate = asObject(value)
  const hero = asObject(candidate.hero)
  const video = asObject(candidate.video)
  const cta = asObject(candidate.cta)
  return {
    hero: {
      title: asString(hero.title, defaultHomeContent.hero.title),
      subtitle: asString(hero.subtitle, defaultHomeContent.hero.subtitle),
      year: asString(hero.year, defaultHomeContent.hero.year),
      backgroundImage: asString(hero.backgroundImage, ""),
    },
    video: {
      title: asString(video.title, defaultHomeContent.video.title),
      description: asString(video.description, defaultHomeContent.video.description),
      url: asString(video.url, defaultHomeContent.video.url),
    },
    cta: {
      title: asString(cta.title, defaultHomeContent.cta.title),
      description: asString(cta.description, defaultHomeContent.cta.description),
      buttonText: asString(cta.buttonText, defaultHomeContent.cta.buttonText),
      buttonLink: asString(cta.buttonLink, defaultHomeContent.cta.buttonLink),
      enabled: asBoolean(cta.enabled, true),
    },
  }
}

export const getPublicSiteSettings = unstable_cache(
  async function getPublicSiteSettings() {
    try {
      const keys = new Set([
        "socialMedia",
        "contactInfo",
        "footerSettings",
        "quickLinks",
        "homeContent",
      ])
      const snapshot = await getFirestoreDb()
        .collection(firestoreCollections.siteSettings)
        .get()
      const rows = snapshot.docs
        .map((document) => document.data() as { key: string; value: unknown })
        .filter((row) => keys.has(row.key))
      const values = Object.fromEntries(rows.map((row) => [row.key, row.value]))
      const social = asObject(values.socialMedia)
      const contact = asObject(values.contactInfo)
      const footer = asObject(values.footerSettings)
      const quickLinks = Array.isArray(values.quickLinks)
        ? values.quickLinks
            .map((item, index) => {
              const link = asObject(item)
              return {
                id:
                  typeof link.id === "string" || typeof link.id === "number"
                    ? link.id
                    : index,
                label: asString(link.label, ""),
                url: asString(link.url, ""),
                enabled: asBoolean(link.enabled, true),
              }
            })
            .filter((link) => link.label && link.url)
        : defaults.quickLinks

      return {
        socialMedia: {
          instagram: asString(social.instagram, officialSocialUrls.instagram),
          youtube: asString(social.youtube, officialSocialUrls.youtube),
          linkedin: asString(social.linkedin, officialSocialUrls.linkedin),
          tiktok: asString(social.tiktok, officialSocialUrls.tiktok),
        },
        contactInfo: {
          email: asString(contact.email, defaults.contactInfo.email),
          phone: asString(contact.phone, ""),
          whatsapp: asString(contact.whatsapp, ""),
          address: asString(contact.address, defaults.contactInfo.address),
          officeHours: asString(contact.officeHours, defaults.contactInfo.officeHours),
        },
        footerSettings: {
          showSocialMedia: asBoolean(footer.showSocialMedia, true),
          showContactInfo: asBoolean(footer.showContactInfo, true),
          showQuickLinks: asBoolean(footer.showQuickLinks, true),
          copyrightText: asString(
            footer.copyrightText,
            defaults.footerSettings.copyrightText,
          ),
        },
        quickLinks,
        homeContent: normalizeHomeContent(values.homeContent),
      }
    } catch {
      return defaults
    }
  },
  ["public-site-settings"],
  { revalidate: 300, tags: [publicCacheTags.settings] },
)
