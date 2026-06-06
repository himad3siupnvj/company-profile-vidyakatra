import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import ketuaLead from "@/assets/lead/Sakhaa_BPH_Final.jpg"
import wakilLead from "@/assets/lead/Latanza_BPH.jpg"
import koorDeptLogo from "@/assets/organ/koor dept.png"
import logoKabinet from "@/assets/logoKabinet.png"
import sekbenLogo from "@/assets/organ/sekben.png"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProfileContent } from "@/lib/profile-content"
import type { ProfileLeader } from "@/lib/profile-content-data"
import { getPublicWorkUnits } from "@/lib/public-profile"
import {
  Cpu,
  Eye,
  Rocket,
  Target,
  Users,
} from "lucide-react"

export const revalidate = 3600

type CabinetLeadPerson = {
  name: string
  position: string
  description: string
  image: StaticImageData
}

const leaderImages: Record<ProfileLeader["imageKey"], StaticImageData> = {
  ketuaLead,
  wakilLead,
}

type LeaderProfileProps = {
  person: CabinetLeadPerson
  reversed?: boolean
}

function LeaderPhotoCard({ person, reversed }: LeaderProfileProps) {
  return (
    <div
      className={cn(
        "group relative mx-auto w-full max-w-60 overflow-hidden rounded-2xl bg-white/[0.035] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.06] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_22px_70px_rgba(250,204,21,0.12)] md:max-w-64",
        reversed && "md:order-2"
      )}
    >
      <div className="absolute inset-x-8 bottom-5 h-24 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-black/30">
        <Image
          src={person.image}
          alt={person.name}
          width={360}
          height={450}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

function LeaderBio({ person, reversed }: LeaderProfileProps) {
  return (
    <div className={cn("pt-3 text-center md:text-left", reversed && "md:order-1")}>
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
          {person.name}
        </h3>
        <p className="mt-1 text-base font-semibold text-[#b8b8b8]">
          {person.position}
        </p>
      </div>
      <p className="mx-auto mt-5 max-w-2xl text-justify text-sm leading-7 text-muted-foreground md:mx-0">
        {person.description}
      </p>
    </div>
  )
}

function LeaderProfile({ person, reversed = false }: LeaderProfileProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-8",
        reversed
          ? "md:grid-cols-[minmax(0,1fr)_16rem]"
          : "md:grid-cols-[16rem_minmax(0,1fr)]"
      )}
    >
      <LeaderPhotoCard person={person} reversed={reversed} />
      <LeaderBio person={person} reversed={reversed} />
    </div>
  )
}

const etymology = [
  {
    term: "Vidya",
    script: "विद्या",
    meaning: "Ilmu pengetahuan, kebijaksanaan, wawasan.",
  },
  {
    term: "Ekatra",
    script: "एकत्र",
    meaning: "Bersatu, bersama, dalam satu tujuan.",
  },
]

const coreTeams = [
  {
    type: "Pengurus Inti",
    name: "Sekretaris",
    description: "Mengelola administrasi, surat-menyurat, notulensi, dan kerapian dokumen organisasi.",
    logo: sekbenLogo,
    programs: ["Surat Menyurat", "Notulensi", "Arsip Kabinet"],
  },
  {
    type: "Pengurus Inti",
    name: "Bendahara",
    description: "Mengatur pencatatan keuangan, perencanaan anggaran, dan transparansi kebutuhan dana kegiatan.",
    logo: sekbenLogo,
    programs: ["Anggaran", "Laporan Keuangan", "Kas Kegiatan"],
  },
  {
    type: "Pengurus Inti",
    name: "Koordinator",
    description: "Menjaga sinkronisasi antarbidang, mengawal ritme program kerja, dan memastikan koordinasi kabinet berjalan efektif.",
    logo: koorDeptLogo,
    programs: ["Koordinasi Bidang", "Monitoring Program", "Evaluasi Kerja"],
  },
]

export default async function ProfilPage() {
  const profileContent = await getProfileContent()
  const workUnits = await getPublicWorkUnits()
  const activeMissions = profileContent.missions.filter((mission) => mission.enabled)
  const activeLeaders = profileContent.leaders.filter((leader) => leader.enabled)

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Cpu className="mr-1.5 h-3 w-3" />
              {profileContent.intro.eyebrow}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">
              {profileContent.intro.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {profileContent.intro.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="relative h-full overflow-hidden rounded-2xl bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(250,204,21,0.16),transparent_42%)]" />
              <div className="relative flex h-full min-h-[25rem] flex-col">
                <Badge className="w-fit border-white/10 bg-white/[0.04] text-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.16)]">
                  <Rocket className="mr-1.5 h-3 w-3" />
                  Tentang Kabinet
                </Badge>

                <div className="flex flex-1 items-center justify-center py-5">
                  <div className="relative">
                    <div className="absolute inset-4 rounded-full bg-yellow-400/20 blur-3xl" />
                    <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl bg-black/30 p-7 shadow-[0_0_70px_rgba(250,204,21,0.16)] ring-1 ring-white/[0.06] md:h-64 md:w-64">
                      <Image
                        src={logoKabinet}
                        alt="Logo Kabinet Vidyakatra"
                        width={220}
                        height={220}
                        className="h-44 w-44 object-contain md:h-52 md:w-52"
                      />
                    </div>
                  </div>
                </div>

                <a
                  href="#struktur"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-[0_12px_36px_rgba(250,204,21,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(250,204,21,0.3)]"
                >
                  Lihat Struktur Kabinet
                  <Users className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            <div className="relative flex h-full items-center overflow-hidden rounded-2xl bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-6">
              <div className="absolute right-0 top-0 h-48 w-48 bg-yellow-400/10 blur-[90px]" />
              <div className="relative w-full space-y-5">
                <div className="max-w-3xl space-y-3">
                  <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                    {profileContent.intro.cabinetName}
                  </h2>
                  <p className="text-sm font-bold uppercase leading-relaxed tracking-[0.18em] text-yellow-400 md:text-base">
                    {profileContent.intro.tagline}
                  </p>
                  <p className="max-w-2xl text-sm leading-relaxed text-[#b5b5b5] md:text-base">
                    {profileContent.intro.description}
                  </p>
                  <p className="inline-flex rounded-xl bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.12)]">
                    Lead the Change with Smart Systems!
                  </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="group rounded-2xl bg-white/[0.035] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_56px_rgba(250,204,21,0.12)]">
                    <p className="text-sm font-semibold text-yellow-400">Makna Etimologis</p>
                    <h3 className="mt-1 text-xl font-bold text-white">Kesatuan dalam Ilmu</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      {etymology.map((item) => (
                        <div key={item.term} className="rounded-xl bg-black/25 p-3">
                          <p className="font-semibold text-white">
                            {item.term} <span className="text-yellow-400">{item.script}</span>
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[#b5b5b5]">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 rounded-xl bg-yellow-400/10 px-4 py-2.5 text-sm italic leading-relaxed text-[#d8d8d8]">
                      "Bersatu dalam Kebijaksanaan dan Pengetahuan."
                    </p>
                  </div>

                  <div className="group rounded-2xl bg-white/[0.035] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_56px_rgba(250,204,21,0.12)]">
                    <p className="text-sm font-semibold text-yellow-400">Makna Filosofis</p>
                    <h3 className="mt-1 text-xl font-bold text-white text-balance">
                      {profileContent.philosophy.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#b5b5b5]">
                      {profileContent.philosophy.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visi-misi" className="border-y border-border/50 bg-card/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {profileContent.vision.enabled && (
            <Card className="border-primary/20 bg-primary/5 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:glow-primary-sm">
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand">
                  <Eye className="h-7 w-7 text-primary-foreground" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">{profileContent.vision.title}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {profileContent.vision.description}
                </p>
              </CardContent>
            </Card>
            )}

            <Card className="border-secondary/20 bg-secondary/5 backdrop-blur transition-all duration-300 hover:border-secondary/40 hover:glow-secondary">
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                  <Target className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Misi</h2>
                <ul className="space-y-3">
                  {activeMissions.map((mission, index) => (
                    <li key={mission.id} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{mission.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="struktur" className="border-y border-border/50 bg-card/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Users className="mr-1.5 h-3 w-3" />
              Struktur Kabinet
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pengurus Inti</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Ketua, wakil ketua, koordinator, sekretaris, dan bendahara yang mengawal arah gerak serta tata kelola kabinet.
            </p>
          </div>

          <div className="mx-auto max-w-5xl space-y-12">
            {activeLeaders.map((leader, index) => (
              <LeaderProfile
                key={leader.id}
                person={{
                  name: leader.name,
                  position: leader.position,
                  description: leader.description,
                  image: leaderImages[leader.imageKey],
                }}
                reversed={index % 2 === 1}
              />
            ))}
          </div>

          <div className="mt-12 space-y-6">
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {coreTeams.slice(0, 2).map((unit) => (
              <Card key={unit.name} className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:glow-primary-sm">
                      <Image
                        src={unit.logo}
                        alt={`Logo ${unit.name}`}
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                      {unit.type}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground">{unit.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {unit.programs.map((program) => (
                      <Badge key={program} variant="secondary" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>

            <div className="mx-auto grid max-w-md gap-6">
              {coreTeams.slice(2).map((unit) => (
                <Card key={unit.name} className="group border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:glow-primary-sm">
                        <Image
                          src={unit.logo}
                          alt={`Logo ${unit.name}`}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                        {unit.type}
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{unit.name}</h3>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {unit.programs.map((program) => (
                        <Badge key={program} variant="secondary" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="divisi" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Users className="mr-1.5 h-3 w-3" />
              Unit Kerja Kabinet
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Departemen & Biro
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Empat departemen dan dua biro yang menjalankan program kerja sesuai kebutuhan organisasi.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workUnits.map((unit) => (
              <Link key={unit.name} href={`/profil/${unit.slug}`} className="group">
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur transition-all duration-300 group-hover:border-primary/30 group-hover:glow-primary-sm">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:glow-primary-sm">
                        <Image
                          src={unit.logo}
                          alt={`Logo ${unit.name}`}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                        {unit.type}
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">{unit.name}</h3>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {unit.programs.map((program) => (
                        <Badge key={program} variant="secondary" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
