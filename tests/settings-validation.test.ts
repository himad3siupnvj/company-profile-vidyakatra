import { describe, expect, it } from "vitest"
import { defaultHomeContent } from "@/lib/home-content"
import { validateHomeContent, validatePublicSettings } from "@/lib/settings-validation"

const validSettings = {
  contactInfo: {
    email: "hima@example.com",
    address: "Jakarta",
    officeHours: "Senin - Jumat",
  },
  socialMedia: {
    instagram: "https://instagram.com/hima",
    youtube: "https://youtube.com/@hima",
    linkedin: "https://linkedin.com/company/hima",
    tiktok: "https://tiktok.com/@hima",
  },
  footerSettings: { copyrightText: "© 2026 HIMA" },
  quickLinks: [{ label: "Profil", url: "/profil", enabled: true }],
  siteSettings: { siteName: "HIMA", siteDescription: "Website resmi HIMA" },
}

describe("settings validation", () => {
  it("accepts valid home content with an internal CTA link", () => {
    expect(validateHomeContent(defaultHomeContent)).toBeNull()
  })

  it("rejects an invalid banner year", () => {
    expect(
      validateHomeContent({
        ...defaultHomeContent,
        hero: { ...defaultHomeContent.hero, year: "tahun depan" },
      }),
    ).toContain("Tahun banner")
  })

  it("rejects an invalid video URL", () => {
    expect(
      validateHomeContent({
        ...defaultHomeContent,
        video: { ...defaultHomeContent.video, url: "javascript:alert(1)" },
      }),
    ).toContain("URL video")
  })

  it("accepts valid public settings", () => {
    expect(validatePublicSettings(validSettings)).toBeNull()
  })

  it("rejects invalid enabled quick links", () => {
    expect(
      validatePublicSettings({
        ...validSettings,
        quickLinks: [{ label: "Rusak", url: "javascript:alert(1)", enabled: true }],
      }),
    ).toContain("tautan cepat")
  })
})
