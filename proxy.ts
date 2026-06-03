import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const sessionCookieName = "cms_session"

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (secret) return secret
  if (process.env.NODE_ENV !== "production") return "development-only-cms-secret"

  throw new Error("JWT_SECRET is required")
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value
  if (!token) return false

  try {
    await jwtVerify(token, new TextEncoder().encode(getJwtSecret()))

    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/x-panel/login") {
    return NextResponse.next()
  }

  if (await hasValidSession(request)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/x-panel/login", request.url)
  loginUrl.searchParams.set("next", pathname)

  const response = NextResponse.redirect(loginUrl)
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  return response
}

export const config = {
  matcher: ["/x-panel/:path*"],
}
