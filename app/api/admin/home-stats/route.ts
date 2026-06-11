import { NextResponse } from "next/server"
import { requireApiPermission } from "@/lib/api-guard"
import { getPublicHomeStats } from "@/lib/public-home-stats"

export async function GET() {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  return NextResponse.json(await getPublicHomeStats())
}
