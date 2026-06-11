import { NextResponse } from "next/server"
import { publicApiHeaders } from "@/lib/public-api"
import { getPublicOrganizationalUnits } from "@/lib/public-directory"

export async function GET() {
  return NextResponse.json(
    { organizationalUnits: await getPublicOrganizationalUnits() },
    { headers: publicApiHeaders },
  )
}
