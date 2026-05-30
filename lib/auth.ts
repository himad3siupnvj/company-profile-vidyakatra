import { scryptSync, timingSafeEqual } from "crypto"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import { jwtVerify, SignJWT } from "jose"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { hasPermission, type Permission, type UserRole } from "@/lib/permissions"

export const sessionCookieName = "cms_session"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface SessionPayload {
  sub: string
  role: UserRole
  exp: number
}

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

function getJwtSecretKey() {
  return new TextEncoder().encode(getJwtSecret())
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

function verifyLegacyScryptPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split("$")

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false
  }

  const expected = Buffer.from(hash, "hex")
  const actual = scryptSync(password, salt, expected.length)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function verifyPassword(password: string, storedHash: string) {
  if (storedHash.startsWith("scrypt$")) {
    return verifyLegacyScryptPassword(password, storedHash)
  }

  return bcrypt.compare(password, storedHash)
}

export async function signSession(payload: Omit<SessionPayload, "exp">, maxAgeSeconds = 60 * 60 * 24 * 7) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(getJwtSecretKey())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())

    if (!payload.sub || !payload.role || typeof payload.exp !== "number") {
      return null
    }

    return {
      sub: payload.sub,
      role: payload.role as UserRole,
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value

  if (!token) {
    return null
  }

  const session = await verifySession(token)

  if (!session) {
    return null
  }

  const db = getDb()
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1)

  if (!user || user.status !== "active") {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function getUserByCredentials(email: string, password: string) {
  const db = getDb()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (!user || user.status !== "active" || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return null
  }

  await db.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id))

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } satisfies AuthUser
}

export function can(user: AuthUser | null, permission: Permission) {
  return Boolean(user && hasPermission(user.role, permission))
}

export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser()

  if (!can(user, permission)) {
    return null
  }

  return user
}
