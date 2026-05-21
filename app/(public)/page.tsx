import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  ChevronRight,
  Cpu,
  Rocket,
} from "lucide-react"

const stats = [
  { label: "Anggota Aktif", value: "150+", icon: Users },
  { label: "Program Kerja", value: "25+", icon: Calendar },
  { label: "Prestasi", value: "50+", icon: Trophy },
  { label: "Tahun Berdiri", value: "2010", icon: Zap },
]

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
]

const latestNews = [
  {
    id: 1,
    title: "Workshop UI/UX Design Bersama Praktisi Industri",
    excerpt: "Tingkatkan kemampuan desain interface dengan bimbingan langsung dari profesional...",
    date: "15 Mei 2026",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Seminar Nasional Teknologi Informasi 2026",
    excerpt: "Menghadirkan pembicara dari berbagai perusahaan teknologi terkemuka...",
    date: "10 Mei 2026",
    category: "Seminar",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Kompetisi Hackathon Internal HIMA",
    excerpt: "Ajang adu kreativitas dan kemampuan coding antar mahasiswa D3 SI...",
    date: "5 Mei 2026",
    category: "Kompetisi",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  },
]

const achievements = [
  "Juara 1 Lomba Web Development Nasional 2025",
  "Best Innovation Award GEMASTIK 2024",
  "Juara 2 UI/UX Competition 2024",
  "Finalis Hackathon Surabaya 2025",
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Gradient Orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
                <Cpu className="mr-1.5 h-3 w-3" />
                Himpunan Mahasiswa D3 Sistem Informasi
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
                Membangun Generasi
                <span className="text-gradient"> Digital</span> yang Unggul
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                Wadah pengembangan potensi, kreativitas, dan profesionalisme mahasiswa D3 Sistem Informasi dalam bidang teknologi informasi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/profil">
                  <Button size="lg" className="gap-2 bg-gradient-brand text-primary-foreground hover:opacity-90 transition-all duration-300 hover:glow-primary-sm">
                    Tentang Kami
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/kontak">
                  <Button size="lg" variant="outline" className="gap-2 border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                {/* Decorative elements */}
                <div className="absolute left-8 top-8 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-8 right-8 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="relative grid h-full grid-cols-2 gap-4 p-8">
                  <div className="space-y-4">
                    <Card className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                      <CardContent className="p-6">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand transition-transform group-hover:scale-110">
                          <Code className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold">Programming</h3>
                        <p className="text-sm text-muted-foreground">Web, Mobile, IoT</p>
                      </CardContent>
                    </Card>
                    <Card className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
                      <CardContent className="p-6">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-110">
                          <Users className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <h3 className="font-semibold">Networking</h3>
                        <p className="text-sm text-muted-foreground">Kolaborasi & Relasi</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-12 space-y-4">
                    <Card className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                      <CardContent className="p-6">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary transition-transform group-hover:scale-110">
                          <Lightbulb className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold">Innovation</h3>
                        <p className="text-sm text-muted-foreground">Ide & Kreativitas</p>
                      </CardContent>
                    </Card>
                    <Card className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
                      <CardContent className="p-6">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand transition-transform group-hover:scale-110">
                          <Trophy className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold">Achievement</h3>
                        <p className="text-sm text-muted-foreground">Prestasi & Kompetisi</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
                  alt="Kegiatan HIMA D3 SI"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-xl border border-primary/30 bg-card p-6 shadow-xl glow-primary-sm">
                <div className="text-3xl font-bold text-gradient">14+</div>
                <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
              </div>
            </div>
            <div className="space-y-6">
              <Badge className="border-primary/30 bg-primary/10 text-primary">
                <Rocket className="mr-1.5 h-3 w-3" />
                Tentang Kami
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
                Mewadahi Aspirasi dan Kreativitas Mahasiswa
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                HIMA D3 Sistem Informasi adalah organisasi kemahasiswaan yang bergerak dalam pengembangan soft skill dan hard skill mahasiswa program studi D3 Sistem Informasi. Kami berkomitmen untuk menciptakan lingkungan yang mendukung pertumbuhan akademik dan profesional.
              </p>
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                      <ChevronRight className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{achievement}</span>
                  </li>
                ))}
              </ul>
              <Link href="/profil">
                <Button className="gap-2 bg-gradient-brand text-primary-foreground hover:opacity-90 transition-all duration-300">
                  Selengkapnya
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="border-y border-border/50 bg-card/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Users className="mr-1.5 h-3 w-3" />
              Divisi Kami
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Struktur Organisasi
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Berbagai divisi yang bekerja sama untuk mewujudkan visi dan misi organisasi
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((division) => (
              <Card 
                key={division.name} 
                className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:glow-primary-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-gradient-brand group-hover:border-transparent">
                    <division.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold">{division.name}</h3>
                  <p className="text-sm text-muted-foreground">{division.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
                <Zap className="mr-1.5 h-3 w-3" />
                Berita Terbaru
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Kegiatan & Informasi
              </h2>
            </div>
            <Link href="/berita">
              <Button variant="outline" className="gap-2 border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news) => (
              <Card 
                key={news.id} 
                className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                  <h3 className="mb-2 font-semibold leading-tight line-clamp-2 transition-colors group-hover:text-primary">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {news.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-border/50 py-20 md:py-28">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
              Siap Bergabung dengan <span className="text-gradient">HIMA D3 SI</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Mari bersama-sama mengembangkan potensi dan membangun masa depan yang lebih baik
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/kontak">
                <Button size="lg" className="gap-2 bg-gradient-brand text-primary-foreground hover:opacity-90 transition-all duration-300 hover:glow-primary">
                  Hubungi Kami
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/galeri">
                <Button size="lg" variant="outline" className="gap-2 border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  Lihat Galeri
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
