"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClaimAccountPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [claimCode, setClaimCode] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function getClaimError(response: Response) {
    try {
      const data = await response.json()

      if (data.error === "Email, claim code, and password are required") {
        return "Email, claim code, dan password wajib diisi."
      }

      if (data.error === "Password must be at least 8 characters") {
        return "Password minimal 8 karakter."
      }

      if (data.error === "Account not found") {
        return "Akun tidak ditemukan. Pastikan email sudah terdaftar di CMS."
      }

      if (data.error === "Account is already claimed") {
        return "Akun ini sudah pernah diklaim. Silakan masuk lewat halaman login."
      }

      if (data.error === "Account is inactive") {
        return "Akun sedang nonaktif. Hubungi administrator untuk mengaktifkan kembali."
      }

      if (data.error === "Claim service error") {
        return "Layanan claim sedang bermasalah. Coba lagi sebentar."
      }
    } catch {
      // Keep the default message below.
    }

    return "Claim code tidak valid. Cek kembali kode dari administrator."
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, claimCode, password }),
      })

      if (!response.ok) {
        setError(await getClaimError(response))
        return
      }

      router.push("/x-panel/login")
    } catch {
      setError("Klaim akun gagal. Coba lagi sebentar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-white/10 bg-card/95">
        <CardHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Claim Akun CMS</CardTitle>
            <CardDescription>
              Masukkan email, claim code dari administrator, dan password baru.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@himad3si.ac.id"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="claim-code">Claim Code</Label>
              <Input
                id="claim-code"
                value={claimCode}
                onChange={(event) => setClaimCode(event.target.value.toUpperCase())}
                placeholder="A1B2C3D4"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                disabled={isSubmitting}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Claim Akun"}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/x-panel/login">Sudah punya akun? Masuk</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
