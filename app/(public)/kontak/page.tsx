import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Youtube,
} from "lucide-react"

const socialMedia = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@himad3si_its",
    value: "2.5K+",
    caption: "akun terjangkau",
    url: "https://instagram.com/himad3si_its",
    className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
  },
  {
    icon: Youtube,
    name: "YouTube",
    handle: "HIMA D3SI UPNVJ",
    value: "50+",
    caption: "konten kegiatan",
    url: "https://youtube.com",
    className: "border-red-500/30 bg-red-500/10 text-red-300",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    handle: "HIMA D3SI UPNVJ",
    value: "20+",
    caption: "jejaring profesional",
    url: "https://linkedin.com",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  {
    icon: Music2,
    name: "TikTok",
    handle: "@himad3si",
    value: "600K+",
    caption: "views each year",
    url: "https://tiktok.com",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
]

export default function KontakPage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-16 top-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-16 h-96 w-96 rounded-full bg-secondary/10 blur-[160px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl">
              <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary">
                <MessageCircle className="mr-1.5 h-3 w-3" />
                Social Media Overview
              </Badge>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl text-balance">
                Social Media <span className="text-gradient">Overview</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#b8b8b8] md:text-xl">
                Memuat kanal resmi HIMA D3 Sistem Informasi UPN "Veteran" Jakarta untuk membangun jangkauan, meningkatkan interaksi, dan bertumbuh bersama mahasiswa.
              </p>
              <a href="mailto:himpunand3si@gmail.com" className="mt-8 inline-flex">
                <Button className="gap-2 bg-gradient-brand px-6 text-primary-foreground shadow-[0_14px_40px_rgba(250,204,21,0.22)] transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
                  Let&apos;s Collaborate!
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
                  className="group min-h-56 rounded-2xl bg-white/[0.04] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-[0_24px_80px_rgba(250,204,21,0.12)]"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${social.className}`}>
                        <social.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{social.name}</div>
                        <div className="text-xs text-[#b8b8b8]">{social.handle}</div>
                      </div>
                    </div>
                    <div className="mt-auto pt-8 text-center">
                      <div className="text-5xl font-black tracking-tight text-white">{social.value}</div>
                      <div className="mt-2 text-lg font-medium leading-tight text-[#b8b8b8]">{social.caption}</div>
                    </div>
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
