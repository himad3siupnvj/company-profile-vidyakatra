import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <GraduationCap className="h-10 w-10 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            HIMA D3 Sistem Informasi
          </h1>
          <p className="text-lg text-muted-foreground">
            Admin Content Management System
          </p>
        </div>
        <Link href="/admin">
          <Button size="lg" className="gap-2">
            Go to Admin Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
