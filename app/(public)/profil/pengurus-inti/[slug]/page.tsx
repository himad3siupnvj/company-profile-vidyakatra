import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { coreTeams, getCoreTeam } from "@/lib/public-core-team"
import ketuaLead from "@/assets/lead/Sakhaa_BPH_Final.jpg"
import wakilLead from "@/assets/lead/Latanza_BPH.jpg"
import { getProfileContent } from "@/lib/profile-content"

type CoreTeamDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

const leaderImages = {
  ketuaLead,
  wakilLead,
}

function getLeaderSlug(imageKey: keyof typeof leaderImages) {
  return imageKey === "ketuaLead" ? "ketua-umum" : "wakil-ketua"
}

export async function generateStaticParams() {
  const profile = await getProfileContent()
  return [
    ...coreTeams.map((team) => ({ slug: team.slug })),
    ...profile.leaders.map((leader) => ({ slug: getLeaderSlug(leader.imageKey) })),
  ]
}

export async function generateMetadata({ params }: CoreTeamDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const team = getCoreTeam(slug)
  const profile = await getProfileContent()
  const leader = profile.leaders.find(
    (item) => item.enabled && getLeaderSlug(item.imageKey) === slug,
  )

  return team || leader
    ? {
        title: team?.name ?? leader?.name,
        description: team?.description ?? leader?.description,
        alternates: { canonical: `/profil/pengurus-inti/${slug}` },
      }
    : {}
}

export default async function CoreTeamDetailPage({ params }: CoreTeamDetailPageProps) {
  const { slug } = await params
  const team = getCoreTeam(slug)
  const profile = await getProfileContent()
  const leader = profile.leaders.find(
    (item) => item.enabled && getLeaderSlug(item.imageKey) === slug,
  )

  if (!team && !leader) notFound()

  const name = team?.name ?? leader!.name
  const description = team?.description ?? leader!.description
  const type = team?.type ?? leader!.position
  const logo = team?.logo ?? leaderImages[leader!.imageKey]
  const programs = team?.programs ?? ["Arah Strategis", "Koordinasi Kabinet", "Evaluasi Organisasi"]
  const responsibilities = team?.responsibilities ?? [
    "Menjaga arah gerak kabinet tetap selaras dengan visi dan kebutuhan mahasiswa.",
    "Menguatkan koordinasi antarbidang serta komunikasi internal organisasi.",
    "Mengawal evaluasi program kerja dan keberlanjutan budaya kabinet.",
  ]

  return (
    <>
      <section className="border-b border-border/50 bg-card/30 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Button asChild variant="ghost" className="mb-8 gap-2 pl-0 text-muted-foreground hover:text-primary">
            <Link href="/profil#struktur">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Profil
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-medium text-primary">{type}</p>
              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
                {name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {programs.map((program) => (
                  <Badge key={program} variant="secondary">{program}</Badge>
                ))}
              </div>
            </div>

            <div className="mx-auto flex aspect-square w-56 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-8">
              <Image src={logo} alt={name} width={180} height={180} className="h-full w-full object-contain" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-medium text-primary">Ruang lingkup</p>
            <h2 className="text-3xl font-bold tracking-tight">Tanggung jawab {name}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {responsibilities.map((responsibility) => (
              <Card key={responsibility} className="border-border/50 bg-card">
                <CardContent className="p-5">
                  <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{responsibility}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
