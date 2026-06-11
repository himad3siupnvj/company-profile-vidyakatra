import { NextRequest, NextResponse } from "next/server"
import { getUserByCredentials, sessionCookieName, sessionMaxAgeSeconds, signSession } from "@/lib/auth"
import { enforceRateLimit, isSameOriginRequest } from "@/lib/request-guard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.redirect(new URL("/x-panel/login?error=service", request.url))
  }

  const formData = await request.formData()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const nextPath = String(formData.get("next") ?? "")
  const redirectPath = nextPath.startsWith("/x-panel") && nextPath !== "/x-panel/login" ? nextPath : "/x-panel"

  const rateLimitResponse = await enforceRateLimit(request, `auth-login-form:${email || "unknown"}`, 10, 60_000)
  if (rateLimitResponse) {
    return NextResponse.redirect(new URL("/x-panel/login?error=rate-limit", request.url))
  }

  try {
    if (!email || !password) {
      return NextResponse.redirect(new URL("/x-panel/login?error=required", request.url))
    }

    const user = await getUserByCredentials(email, password)

    if (!user) {
      return NextResponse.redirect(new URL("/x-panel/login?error=invalid", request.url))
    }

    const response = NextResponse.redirect(new URL(redirectPath, request.url))
    response.cookies.set(sessionCookieName, await signSession({ sub: user.id, role: user.role }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: sessionMaxAgeSeconds,
    })

    return response
  } catch (error) {
    console.error("Form login failed", error)

    return NextResponse.redirect(new URL("/x-panel/login?error=service", request.url))
  }
}
