import { scryptSync, timingSafeEqual } from "crypto"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { convertFirestoreValue } from "@/db/firestore-data"
import type { CmsUser } from "@/db/models"
import { hasPermission, type Permission, type UserRole } from "@/lib/permissions"

export const sessionCookieName = "cms_session"
export const sessionMaxAgeSeconds = 60 * 60 * 24 * 7

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

export async function signSession(payload: Omit<SessionPayload, "exp">, maxAgeSeconds = sessionMaxAgeSeconds) {
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

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.users)
    .doc(session.sub)
    .get()
  const userData = convertFirestoreValue(snapshot.data()) as Record<string, unknown>
  const user = snapshot.exists
    ? ({ id: snapshot.id, ...userData } as CmsUser)
    : null

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
  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.users)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get()
  const document = snapshot.docs[0]
  const userData = convertFirestoreValue(document?.data()) as Record<string, unknown>
  const user = document
    ? ({ id: document.id, ...userData } as CmsUser)
    : null

  if (!user || user.status !== "active" || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return null
  }

  try {
    await getFirestoreDb()
      .collection(firestoreCollections.users)
      .doc(user.id)
      .update({ lastLoginAt: new Date(), updatedAt: new Date() })
  } catch (error) {
    console.warn("Failed to update lastLoginAt after successful login.", error)
  }

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
