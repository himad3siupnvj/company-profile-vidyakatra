import Link from "next/link";
import Image from "next/image";
import kabinetImage from "@/assets/kabinet.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicNews } from "@/lib/public-articles";
import { getPublicHomeStats } from "@/lib/public-home-stats";
import { getPublicSiteSettings } from "@/lib/public-site-settings";
import {
  Users,
  Calendar,
  Building2,
  Newspaper,
  ArrowRight,
  Play,
  User,
  Clock,
} from "lucide-react";

export const revalidate = 300;

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
  const [news, homeStats, settings] = await Promise.all([
    getPublicNews(),
    getPublicHomeStats(),
    getPublicSiteSettings(),
  ]);
  const latestNews = news.slice(0, 3);
  const { homeContent } = settings;
  const stats = [
    { label: "Anggota Aktif", value: homeStats.activeMembers, icon: Users },
    { label: "Unit Kerja Aktif", value: homeStats.activeUnits, icon: Building2 },
    { label: "Berita Terbit", value: homeStats.publishedArticles, icon: Newspaper },
    { label: "Periode Aktif", value: homeStats.activePeriod, icon: Calendar },
  ];

  return (
    <>
      {/* Cabinet Banner */}
      <section className="py-4 md:py-5">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl border border-border/50 bg-muted">
            <Image
              src={homeContent.hero.backgroundImage || kabinetImage}
              alt="Foto kabinet HIMA D3 SI"
              fill
              sizes="(min-width: 1280px) 1216px, calc(100vw - 2rem)"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 top-6 flex flex-col items-center px-6 text-center md:top-8 md:px-8">
              <h2 className="max-w-5xl text-balance text-2xl font-bold leading-tight text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] sm:text-3xl md:text-5xl">
                {homeContent.hero.title}
              </h2>
              <p className="mt-2 text-xl font-semibold text-white/80 drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)] sm:text-2xl md:text-4xl">
                {homeContent.hero.subtitle}
              </p>
              <p className="mt-2 text-xl font-semibold text-white/80 drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)] sm:text-2xl md:text-4xl">
                {homeContent.hero.year}
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
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                <Play className="h-4 w-4" />
                Video profil
              </div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                {homeContent.video.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {homeContent.video.description}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-lg">
              <div className="aspect-video">
                <iframe
                  src={homeContent.video.url}
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
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">
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

      {/* News Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-primary">Berita terbaru</p>
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
                <Card className="group h-full gap-0 overflow-hidden border-border/50 bg-card p-0 transition-colors hover:border-primary/50">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={800}
                      height={500}
                      className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    <h3 className="mb-2 line-clamp-2 font-semibold leading-tight text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {news.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{news.author}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {news.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {homeContent.cta.enabled && (
      <section className="relative overflow-hidden border-t border-border/50 py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
              {homeContent.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {homeContent.cta.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={homeContent.cta.buttonLink}>
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-brand text-primary-foreground transition-colors hover:opacity-90"
                >
                  {homeContent.cta.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
