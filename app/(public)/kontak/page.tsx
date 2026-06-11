import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Youtube,
} from "lucide-react"
import { officialSocialLinks } from "@/lib/social-links"
import { getPublicSiteSettings } from "@/lib/public-site-settings"

export const revalidate = 3600

export default async function KontakPage() {
  const { socialMedia: urls, contactInfo } = await getPublicSiteSettings()
  const socialMedia = [
    { icon: Instagram, name: officialSocialLinks.instagram.label, handle: officialSocialLinks.instagram.handle, url: urls.instagram, className: "border-pink-500/30 bg-pink-500/10 text-pink-300" },
    { icon: Youtube, name: officialSocialLinks.youtube.label, handle: officialSocialLinks.youtube.handle, url: urls.youtube, className: "border-red-500/30 bg-red-500/10 text-red-300" },
    { icon: Linkedin, name: officialSocialLinks.linkedin.label, handle: officialSocialLinks.linkedin.handle, url: urls.linkedin, className: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
    { icon: Music2, name: officialSocialLinks.tiktok.label, handle: officialSocialLinks.tiktok.handle, url: urls.tiktok, className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200" },
  ]

  return (
    <>
      <section className="border-b border-border/50 bg-card/30 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                <MessageCircle className="mr-1.5 h-3 w-3" />
                Kanal resmi
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-balance">
                Terhubung dengan HIMA D3 SI
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Ikuti kegiatan dan informasi organisasi melalui kanal resmi kami, atau hubungi tim untuk kebutuhan kolaborasi.
              </p>
              <a href={`mailto:${contactInfo.email}`} className="mt-8 inline-flex">
                <Button className="gap-2 px-6">
                  Ajukan Kolaborasi
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${social.className}`}>
                        <social.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{social.name}</div>
                        <div className="text-sm text-muted-foreground">{social.handle}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
