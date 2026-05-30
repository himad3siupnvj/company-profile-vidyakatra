import { NextResponse } from "next/server"
import { requirePermission } from "@/lib/auth"
import type { Permission } from "@/lib/permissions"

export async function requireApiPermission(permission: Permission) {
  const user = await requirePermission(permission)

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { user, response: null }
}
