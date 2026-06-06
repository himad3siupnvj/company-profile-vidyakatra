import { NextRequest, NextResponse } from "next/server"
import { getUserByCredentials, sessionCookieName, sessionMaxAgeSeconds, signSession } from "@/lib/auth"
import { enforceRateLimit, isSameOriginRequest } from "@/lib/request-guard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    }

    const payload = await request.json()
    const email = String(payload.email ?? "").trim().toLowerCase()
    const password = String(payload.password ?? "")

    const rateLimitResponse = enforceRateLimit(request, `auth-login:${email || "unknown"}`, 10, 60_000)
    if (rateLimitResponse) return rateLimitResponse

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
      maxAge: sessionMaxAgeSeconds,
    })

    return response
  } catch (error) {
    console.error("Login failed", error)

    return NextResponse.json({ error: "Login service error" }, { status: 500 })
  }
}
