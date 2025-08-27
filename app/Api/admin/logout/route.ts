export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { clearAdminSession } from "@/lib/auth-cookie"

export async function POST() {
  clearAdminSession()
  return NextResponse.json({ ok: true })
}


