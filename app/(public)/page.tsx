import Link from "next/link";
import Image from "next/image";
import kabinetImage from "@/assets/kabinet.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicNews } from "@/lib/public-articles";
import {
  Zap,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Lightbulb,
  Code,
  Megaphone,
  BookOpen,
  Cpu,
  Instagram,
  Linkedin,
  Music2,
  Rocket,
  Sparkles,
  Play,
  Youtube,
} from "lucide-react";

const stats = [
  { label: "Anggota Aktif", value: "50+", icon: Users },
  { label: "Program Kerja", value: "25+", icon: Calendar },
  { label: "Prestasi", value: "50+", icon: Trophy },
  { label: "Tahun Berdiri", value: "2023  ", icon: Zap },
];

const divisions = [
  {
    name: "Akademik",
    description: "Mengembangkan potensi akademik dan keilmuan mahasiswa",
    icon: BookOpen,
  },
  {
    name: "Teknologi",
    description: "Wadah pengembangan skill programming dan IT",
    icon: Code,
  },
  {
    name: "Kreativitas",
    description: "Mengasah kreativitas melalui berbagai kegiatan seni",
    icon: Lightbulb,
  },
  {
    name: "Humas",
    description: "Menjalin hubungan dengan pihak internal dan eksternal",
    icon: Megaphone,
  },
];

const socialMedia = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@himad3si_upnvj",
    value: "2.5K+",
    caption: "akun terjangkau",
    url: "https://instagram.com/himad3si_upnvj",
    className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
  },
  {
    icon: Youtube,
    name: "YouTube",
    handle: "HIMA D3SI UPNVJ",
    value: "50+",
    caption: "konten kegiatan",
    url: "https://youtube.com/@himad3siupnvj?si=AxW5-zV-xXaZjR6n",
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
];

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    berita: "Berita",
    kegiatan: "Kegiatan",
    pengumuman: "Pengumuman",
    prestasi: "Prestasi",
  };

  return labels[category] ?? "Berita";
}

export default async function HomePage() {
  const latestNews = (await getPublicNews()).slice(0, 3);

  return (
    <>
      {/* Cabinet Banner */}
      <section className="py-4 md:py-5">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl border border-border/50 bg-muted">
            <Image
              src={kabinetImage}
              alt="Foto kabinet HIMA D3 SI"
              fill
              sizes="(min-width: 1280px) 1216px, calc(100vw - 2rem)"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 top-6 flex flex-col items-center px-6 text-center md:top-8 md:px-8">
              <Badge className="mb-5 border-primary/40 bg-primary/15 px-4 py-1.5 text-sm text-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.18)] backdrop-blur">
                <Sparkles className="mr-1.5 h-3 w-3" />
                Kabinet Vidyakatra
              </Badge>
              <h2 className="max-w-5xl text-balance text-2xl font-bold leading-tight text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:text-3xl md:text-5xl">
                Himpunan Mahasiswa D3 Sistem Informasi
              </h2>
              <p className="mt-2 text-xl font-semibold text-white/80 drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)] sm:text-2xl md:text-4xl">
                UPN "Veteran" Jakarta
              </p>
              <p className="mt-2 text-xl font-semibold text-white/80 drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)] sm:text-2xl md:text-4xl">
                2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile Video */}
      <section className="border-y border-border/50 bg-card/30 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="max-w-xl">
              <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
                <Play className="mr-1.5 h-3 w-3" />
                Company Profile
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Kenali Kabinet Vidyakatra Lebih Dekat
              </h2>
              <p className="mt-4 text-muted-foreground">
                Video singkat tentang arah gerak, budaya kerja, dan ruang
                kolaborasi HIMA D3 Sistem Informasi UPNVJ.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-lg">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/WV3rSsxRyb4?si=gA9Nrks6Grfqx0sm"
                  className="h-full w-full"
                  title="Video company profile HIMA D3 Sistem Informasi UPNVJ Kabinet Vidyakatra"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/50 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="group text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:border-primary/40 group-hover:glow-primary-sm">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Overview */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute left-16 top-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-16 h-96 w-96 rounded-full bg-secondary/10 blur-[160px]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl">
              <Badge className="mb-5 border-primary/30 bg-primary/10 text-primary">
                <Megaphone className="mr-1.5 h-3 w-3" />
                Social Media Overview
              </Badge>
              <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl text-balance">
                Social Media <span className="text-gradient">Overview</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#b8b8b8]">
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
                  className="group min-h-52 rounded-2xl bg-white/[0.04] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-[0_24px_80px_rgba(250,204,21,0.12)]"
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

      {/* News Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
                <Zap className="mr-1.5 h-3 w-3" />
                Berita Acara Terbaru
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Kegiatan & Berita Acara
              </h2>
            </div>
            <Link href="/berita">
              <Button
                variant="outline"
                className="gap-2 border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news) => (
              <Link key={news.id} href={`/berita/${news.slug}`} className="min-w-0">
                <Card className="group h-full overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={800}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs">
                        {getCategoryLabel(news.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {news.date}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
                      {news.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {news.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-border/50 py-16 md:py-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
              Kenali Arah Gerak{" "}
              <span className="text-gradient">Kabinet Vidyakatra</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Lihat profil, nilai, dan struktur kerja kabinet yang menggerakkan HIMA D3 Sistem Informasi.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/profil">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-brand text-primary-foreground hover:opacity-90 transition-all duration-300 hover:glow-primary"
                >
                  Lihat Profil Kabinet
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
