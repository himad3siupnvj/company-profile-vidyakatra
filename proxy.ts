import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const sessionCookieName = "cms_session"

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV !== "production") {
    return "development-only-cms-secret"
  }

  throw new Error("JWT_SECRET is required")
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value

  if (!token) {
    return false
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(getJwtSecret()))
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminApi = pathname.startsWith("/api/admin")
  const isPanelRoute = pathname.startsWith("/x-panel")
  const isLoginRoute = pathname === "/x-panel/login"

  if ((!isAdminApi && !isPanelRoute) || isLoginRoute) {
    return NextResponse.next()
  }

  if (await hasValidSession(request)) {
    return NextResponse.next()
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/x-panel/login"
  loginUrl.searchParams.set("next", pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/x-panel/:path*", "/api/admin/:path*"],
}
