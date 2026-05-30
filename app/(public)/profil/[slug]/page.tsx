import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { workUnits } from "@/lib/public-content"

type UnitDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return workUnits.map((unit) => ({ slug: unit.slug }))
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { slug } = await params
  const unit = workUnits.find((item) => item.slug === slug)

  if (!unit) {
    notFound()
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50 py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.24)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.24)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Button asChild variant="ghost" className="mb-8 gap-2 pl-0 text-muted-foreground hover:text-primary">
            <Link href="/profil#divisi">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Profil
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                {unit.type}
              </Badge>
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

            <div className="mx-auto flex aspect-square w-56 items-center justify-center rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
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

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary">
                <Users className="mr-1.5 h-3 w-3" />
                Anggota
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Member {unit.name}</h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {unit.members.map((member) => (
              <Card key={member.name} className="overflow-hidden border-border/50 bg-card/80 backdrop-blur">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={500}
                    height={650}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm text-primary">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/30 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8">
            <Badge className="mb-3 bg-primary/10 text-primary">
              <BriefcaseBusiness className="mr-1.5 h-3 w-3" />
              Program Kerja
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Proker {unit.name}</h2>
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
