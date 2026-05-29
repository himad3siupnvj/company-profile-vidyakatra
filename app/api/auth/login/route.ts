import { NextRequest, NextResponse } from "next/server"
import { getUserByCredentials, sessionCookieName, signSession } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const email = String(payload.email ?? "").trim().toLowerCase()
  const password = String(payload.password ?? "")

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const user = await getUserByCredentials(email, password)

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const response = NextResponse.json({ user })
  response.cookies.set(sessionCookieName, await signSession({ sub: user.id, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
