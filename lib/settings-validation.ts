import type { PublicHomeContent } from "@/lib/home-content"

type PublicSettingsInput = {
  contactInfo: { email: string; address: string; officeHours: string }
  socialMedia: Record<string, string>
  footerSettings: { copyrightText: string }
  quickLinks: Array<{ label: string; url: string; enabled: boolean }>
  siteSettings: { siteName: string; siteDescription: string }
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isLink(value: string) {
  return value.startsWith("/") || isHttpUrl(value)
}

export function validateHomeContent(content: PublicHomeContent) {
  if (
    !content ||
    typeof content !== "object" ||
    !content.hero ||
    !content.video ||
    !content.cta ||
    typeof content.hero.title !== "string" ||
    typeof content.hero.subtitle !== "string" ||
    typeof content.hero.year !== "string" ||
    typeof content.video.title !== "string" ||
    typeof content.video.description !== "string" ||
    typeof content.video.url !== "string" ||
    typeof content.cta.title !== "string" ||
    typeof content.cta.description !== "string" ||
    typeof content.cta.buttonText !== "string" ||
    typeof content.cta.buttonLink !== "string" ||
    typeof content.cta.enabled !== "boolean"
  ) {
    return "Struktur konten Beranda tidak valid."
  }
  if (!content.hero.title.trim() || !content.hero.subtitle.trim() || !content.hero.year.trim()) {
    return "Judul, subjudul, dan tahun banner wajib diisi."
  }
  if (!/^\d{4}(?:\/\d{4})?$/.test(content.hero.year.trim())) {
    return "Tahun banner harus berupa tahun, misalnya 2026 atau 2026/2027."
  }
  if (!content.video.title.trim() || !content.video.description.trim()) {
    return "Judul dan deskripsi video wajib diisi."
  }
  if (!isHttpUrl(content.video.url)) {
    return "URL video harus berupa tautan HTTP atau HTTPS yang valid."
  }
  if (content.cta.enabled) {
    if (!content.cta.title.trim() || !content.cta.description.trim() || !content.cta.buttonText.trim()) {
      return "Judul, deskripsi, dan teks tombol ajakan wajib diisi."
    }
    if (!isLink(content.cta.buttonLink.trim())) {
      return "Tautan ajakan harus berupa path internal atau URL HTTP/HTTPS."
    }
  }
  return null
}

export function validatePublicSettings(settings: PublicSettingsInput) {
  if (
    !settings ||
    typeof settings !== "object" ||
    !settings.contactInfo ||
    !settings.socialMedia ||
    !settings.footerSettings ||
    !Array.isArray(settings.quickLinks) ||
    !settings.siteSettings ||
    typeof settings.contactInfo.email !== "string" ||
    typeof settings.contactInfo.address !== "string" ||
    typeof settings.contactInfo.officeHours !== "string" ||
    typeof settings.footerSettings.copyrightText !== "string" ||
    typeof settings.siteSettings.siteName !== "string" ||
    typeof settings.siteSettings.siteDescription !== "string" ||
    Object.values(settings.socialMedia).some((url) => typeof url !== "string") ||
    settings.quickLinks.some(
      (link) =>
        !link ||
        typeof link.label !== "string" ||
        typeof link.url !== "string" ||
        typeof link.enabled !== "boolean",
    )
  ) {
    return "Struktur pengaturan website tidak valid."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactInfo.email.trim())) {
    return "Alamat email kontak tidak valid."
  }
  if (!settings.contactInfo.address.trim() || !settings.contactInfo.officeHours.trim()) {
    return "Alamat dan jam layanan wajib diisi."
  }
  for (const [platform, url] of Object.entries(settings.socialMedia)) {
    if (!isHttpUrl(url.trim())) return `URL ${platform} tidak valid.`
  }
  for (const link of settings.quickLinks.filter((item) => item.enabled)) {
    if (!link.label.trim() || !isLink(link.url.trim())) {
      return "Setiap tautan cepat yang aktif harus memiliki label dan URL valid."
    }
  }
  if (!settings.siteSettings.siteName.trim() || !settings.siteSettings.siteDescription.trim()) {
    return "Nama dan deskripsi website wajib diisi."
  }
  if (!settings.footerSettings.copyrightText.trim()) {
    return "Teks hak cipta wajib diisi."
  }
  return null
}
