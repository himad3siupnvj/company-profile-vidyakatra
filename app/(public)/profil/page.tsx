import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Eye,
  Users,
  Award,
  BookOpen,
  Code,
  Lightbulb,
  Megaphone,
  Heart,
  Zap,
  Shield,
  Cpu,
  Rocket,
} from "lucide-react"

const timeline = [
  {
    year: "2010",
    title: "Pendirian HIMA",
    description: "HIMA D3 Sistem Informasi resmi didirikan sebagai wadah aspirasi mahasiswa.",
  },
  {
    year: "2015",
    title: "Ekspansi Program",
    description: "Penambahan berbagai program kerja baru dan pembentukan divisi-divisi strategis.",
  },
  {
    year: "2020",
    title: "Transformasi Digital",
    description: "Adaptasi kegiatan ke format hybrid dan pengembangan platform digital organisasi.",
  },
  {
    year: "2024",
    title: "Era Baru",
    description: "Pencapaian berbagai prestasi nasional dan perluasan jaringan kerjasama.",
  },
]

const divisions = [
  {
    name: "Bidang Akademik",
    description: "Mengelola kegiatan yang berkaitan dengan pengembangan akademik dan keilmuan mahasiswa D3 SI.",
    icon: BookOpen,
    programs: ["Tutorial Mata Kuliah", "Seminar Akademik", "Study Club"],
  },
  {
    name: "Bidang Teknologi",
    description: "Wadah pengembangan skill programming, networking, dan teknologi informasi.",
    icon: Code,
    programs: ["Workshop Coding", "Hackathon Internal", "Tech Talk"],
  },
  {
    name: "Bidang Kreativitas",
    description: "Mengasah kreativitas dan bakat mahasiswa melalui berbagai kegiatan seni dan budaya.",
    icon: Lightbulb,
    programs: ["Design Contest", "Photography Club", "Creative Campaign"],
  },
  {
    name: "Bidang Humas",
    description: "Menjalin hubungan baik dengan pihak internal dan eksternal organisasi.",
    icon: Megaphone,
    programs: ["Media Sosial", "Partnership", "Public Relations"],
  },
]

const coreValues = [
  {
    name: "Integritas",
    description: "Menjunjung tinggi kejujuran dan etika dalam setiap tindakan",
    icon: Shield,
  },
  {
    name: "Inovasi",
    description: "Selalu berinovasi dan mengikuti perkembangan teknologi",
    icon: Zap,
  },
  {
    name: "Kolaborasi",
    description: "Bekerja sama untuk mencapai tujuan bersama",
    icon: Users,
  },
  {
    name: "Dedikasi",
    description: "Berkomitmen penuh dalam setiap kegiatan dan tanggung jawab",
    icon: Heart,
  },
]

const leadership = [
  {
    name: "Ahmad Fauzi Rahman",
    position: "Ketua Umum",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    quote: "Bersama membangun generasi digital yang unggul",
  },
  {
    name: "Siti Nurhaliza",
    position: "Wakil Ketua",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    quote: "Kolaborasi adalah kunci kesuksesan",
  },
  {
    name: "Budi Santoso",
    position: "Sekretaris Umum",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    quote: "Dokumentasi yang baik, organisasi yang kuat",
  },
  {
    name: "Dewi Lestari",
    position: "Bendahara Umum",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    quote: "Transparansi adalah fondasi kepercayaan",
  },
]

const missions = [
  "Mengembangkan potensi akademik dan soft skill mahasiswa D3 Sistem Informasi",
  "Menjadi wadah aspirasi dan kreativitas mahasiswa dalam bidang teknologi",
  "Membangun jejaring kerjasama dengan berbagai pihak internal dan eksternal",
  "Menyelenggarakan kegiatan yang bermanfaat bagi pengembangan diri mahasiswa",
  "Meningkatkan peran aktif mahasiswa dalam pembangunan bangsa",
]

export default function ProfilPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Cpu className="mr-1.5 h-3 w-3" />
              Tentang Kami
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Profil <span className="text-gradient">HIMA D3 SI</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Mengenal lebih dekat organisasi yang mewadahi aspirasi dan kreativitas mahasiswa
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge className="border-primary/30 bg-primary/10 text-primary">
                <Rocket className="mr-1.5 h-3 w-3" />
                Sejarah
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
                Perjalanan HIMA D3 SI
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Himpunan Mahasiswa D3 Sistem Informasi didirikan pada tahun 2010 sebagai wadah untuk menampung aspirasi, mengembangkan kreativitas, dan meningkatkan kompetensi mahasiswa program studi D3 Sistem Informasi.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Selama lebih dari satu dekade, HIMA D3 SI telah menjadi rumah bagi ratusan mahasiswa yang ingin mengembangkan diri di luar kegiatan akademik. Berbagai prestasi telah diraih, baik di tingkat regional maupun nasional.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand glow-primary-sm">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">14+ Tahun</div>
                  <div className="text-muted-foreground">Melayani Mahasiswa</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
                  alt="Sejarah HIMA D3 SI"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="border-y border-border/50 bg-card/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Zap className="mr-1.5 h-3 w-3" />
              Timeline
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Perjalanan Waktu
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-primary/20 md:block" />
            <div className="space-y-8 md:space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`flex flex-col gap-4 md:flex-row md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    <Card className="inline-block border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                      <CardContent className="p-6">
                        <div className="mb-2 text-2xl font-bold text-gradient">{item.year}</div>
                        <h3 className="mb-2 font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden h-4 w-4 shrink-0 self-center rounded-full bg-gradient-brand glow-primary-sm md:block" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="visi-misi" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Vision */}
            <Card className="border-primary/20 bg-primary/5 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:glow-primary-sm">
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand">
                  <Eye className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Visi</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Menjadi himpunan mahasiswa yang unggul, inovatif, dan profesional dalam mengembangkan potensi mahasiswa D3 Sistem Informasi untuk menghadapi tantangan era digital global.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-secondary/20 bg-secondary/5 backdrop-blur transition-all duration-300 hover:border-secondary/40 hover:glow-secondary">
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                  <Target className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Misi</h2>
                <ul className="space-y-3">
                  {missions.map((mission, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{mission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="border-y border-border/50 bg-card/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Shield className="mr-1.5 h-3 w-3" />
              Nilai-Nilai Inti
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Prinsip yang Kami Pegang
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <Card key={value.name} className="group text-center border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:glow-primary-sm">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-gradient-brand group-hover:border-transparent">
                    <value.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.name}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="struktur" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Users className="mr-1.5 h-3 w-3" />
              Struktur Organisasi
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Pengurus Inti
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Tim yang memimpin dan mengelola kegiatan HIMA D3 SI periode 2024-2025
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((leader) => (
              <Card key={leader.name} className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold">{leader.name}</h3>
                  <p className="text-sm text-gradient font-medium">{leader.position}</p>
                  <p className="mt-3 text-xs italic text-muted-foreground">&ldquo;{leader.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section id="divisi" className="border-y border-border/50 bg-card/30 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Code className="mr-1.5 h-3 w-3" />
              Bidang Kerja
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Divisi Organisasi
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {divisions.map((division) => (
              <Card key={division.name} className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-gradient-brand group-hover:border-transparent">
                      <division.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{division.name}</h3>
                      <p className="text-sm text-muted-foreground">{division.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {division.programs.map((program) => (
                          <Badge key={program} className="text-xs bg-secondary/20 text-secondary hover:bg-secondary/30">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge className="border-primary/30 bg-primary/10 text-primary">
                <Award className="mr-1.5 h-3 w-3" />
                Prestasi
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">
                Capaian yang Membanggakan
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Berbagai prestasi telah diraih oleh anggota HIMA D3 SI dalam berbagai kompetisi di tingkat regional hingga nasional.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                  <div className="text-4xl font-bold text-gradient">50+</div>
                  <div className="text-sm text-muted-foreground">Prestasi Diraih</div>
                </div>
                <div className="text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
                  <div className="text-4xl font-bold text-gradient">25+</div>
                  <div className="text-sm text-muted-foreground">Kompetisi Diikuti</div>
                </div>
                <div className="text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                  <div className="text-4xl font-bold text-gradient">10+</div>
                  <div className="text-sm text-muted-foreground">Juara Nasional</div>
                </div>
                <div className="text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
                  <div className="text-4xl font-bold text-gradient">100+</div>
                  <div className="text-sm text-muted-foreground">Sertifikat</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop"
                  alt="Prestasi HIMA D3 SI"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-primary/30 bg-card p-6 shadow-xl glow-primary-sm">
                <Award className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
