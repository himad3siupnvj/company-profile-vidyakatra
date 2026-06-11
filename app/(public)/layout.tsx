import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getPublicSiteSettings } from "@/lib/public-site-settings"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { socialMedia } = await getPublicSiteSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar socialMedia={socialMedia} />
      <main className="flex-1">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <Footer socialMedia={socialMedia} />
    </div>
  )
}
