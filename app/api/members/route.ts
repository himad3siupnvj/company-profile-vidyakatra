import { NextResponse } from "next/server"
import { publicApiHeaders } from "@/lib/public-api"
import { getPublicMembers } from "@/lib/public-directory"

export async function GET() {
  return NextResponse.json(
    { members: await getPublicMembers() },
    { headers: publicApiHeaders },
  )
}
