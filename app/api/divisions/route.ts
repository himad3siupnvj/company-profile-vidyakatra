import { NextResponse } from "next/server"
import { publicApiHeaders } from "@/lib/public-api"
import { getPublicDivisions } from "@/lib/public-directory"

export async function GET() {
  return NextResponse.json(
    { divisions: await getPublicDivisions() },
    { headers: publicApiHeaders },
  )
}
