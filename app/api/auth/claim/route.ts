import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Account claim is disabled. CMS uses a single administrator account." },
    { status: 403 },
  )
}
