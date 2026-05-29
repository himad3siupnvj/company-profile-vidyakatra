"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LockKeyhole, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loginPhase, setLoginPhase] = useState<"idle" | "submitting" | "redirecting">("idle")

  const isSubmitting = loginPhase !== "idle"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoginPhase("submitting")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setError("Email atau password tidak sesuai.")
        setLoginPhase("idle")
        return
      }

      setLoginPhase("redirecting")
      router.push("/x-panel")
      router.refresh()
    } catch {
      setError("Login gagal. Coba lagi sebentar.")
      setLoginPhase("idle")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-white/10 bg-card/95">
        <CardHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Masuk CMS</CardTitle>
            <CardDescription>
              Gunakan akun admin HIMA D3SI yang sudah dibuat administrator.
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
                placeholder="admin@himad3si.ac.id"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                disabled={isSubmitting}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full gap-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loginPhase === "redirecting" ? "Membuka dashboard..." : loginPhase === "submitting" ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {loginPhase === "redirecting" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-card p-6 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <p className="text-base font-semibold text-foreground">Membuka dashboard</p>
            <p className="mt-2 text-sm text-muted-foreground">Menyiapkan sesi admin...</p>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-[login-progress_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
