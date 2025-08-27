export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth-cookie"
import { supabase, hasValidConfig } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!hasValidConfig || !supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  try {
    // For now, return mock data to get the dashboard working
    // We'll implement real data fetching once the basic flow works
    const stats = {
      resources: 0,
      incidents: {
        total: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0,
      },
      contacts: {
        total: 0,
        pending: 0,
        responded: 0,
        closed: 0,
      },
      newsletterSubscribers: 0,
    }


    return NextResponse.json({ stats })
  } catch (e) {
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 })
  }
}


