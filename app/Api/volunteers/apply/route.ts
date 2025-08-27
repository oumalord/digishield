export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { supabase, hasValidConfig } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  if (!hasValidConfig || !supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  try {
    const body = await req.json()
    const { name, email, phone, location, role, skills, availability } = body || {}
    if (!name || !email || !phone || !location || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const { data, error } = await supabase
      .from("volunteers")
      .insert([
        {
          name,
          email,
          phone,
          location,
          role,
          skills: Array.isArray(skills) ? skills : (skills ? [String(skills)] : []),
          availability: availability || "",
          status: "pending",
          join_date: new Date().toISOString(),
        },
      ])
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 })
  }
}


