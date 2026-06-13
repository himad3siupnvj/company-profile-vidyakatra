import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { MemberCarousel } from "@/components/public/member-carousel"
import { getPublicWorkUnits } from "@/lib/public-profile"

type UnitDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const workUnits = await getPublicWorkUnits()

  return workUnits.map((unit) => ({ slug: unit.slug }))
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { slug } = await params
  const workUnits = await getPublicWorkUnits()
  const unit = workUnits.find((item) => item.slug === slug)

  if (!unit) {
    notFound()
  }

  return (
    <>
      <section className="border-b border-border/50 bg-card/30 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Button asChild variant="ghost" className="mb-8 gap-2 pl-0 text-muted-foreground hover:text-primary">
            <Link href="/profil#divisi">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Profil
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-medium text-primary">{unit.type}</p>
              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
                {unit.name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {unit.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {unit.programs.map((program) => (
                  <Badge key={program} variant="secondary">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mx-auto flex aspect-square w-56 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-8">
              <Image
                src={unit.logo}
                alt={`Logo ${unit.name}`}
                width={180}
                height={180}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section anggota disembunyikan sementara sampai foto pengurus siap ditampilkan.
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-medium text-primary">Anggota</p>
              <h2 className="text-3xl font-bold tracking-tight">Anggota {unit.name}</h2>
            </div>
          </div>

          <MemberCarousel members={unit.members} />
        </div>
      </section>
      */}

      <section className="border-y border-border/50 bg-card/30 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-primary">Program kerja</p>
            <h2 className="text-3xl font-bold tracking-tight">Program kerja {unit.name}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Rangkaian program kerja yang menjadi fokus {unit.type.toLowerCase()} selama periode Kabinet Vidyakatra.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {unit.workPrograms.map((program) => (
              <Card key={program.name} className="border-border/50 bg-background/70">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{program.status}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
