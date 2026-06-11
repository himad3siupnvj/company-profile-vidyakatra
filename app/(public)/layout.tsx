import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getPublicSiteSettings } from "@/lib/public-site-settings"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getPublicSiteSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar socialMedia={settings.socialMedia} />
      <main className="flex-1">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <Footer settings={settings} />
    </div>
  )
}
