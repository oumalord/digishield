import { NextRequest, NextResponse } from "next/server"
import { subscribeToNewsletter } from "@/lib/database-operations"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    console.log("Newsletter subscription API called")
    
    // Check if request has proper content type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType)
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    const body = await request.json().catch((error) => {
      console.error("Failed to parse JSON:", error)
      return {}
    })
    
    console.log("Request body:", body)
    
    const { email, name } = body || {}

    if (!email || typeof email !== "string") {
      console.error("Missing or invalid email:", email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Calling subscribeToNewsletter with:", { email, name })
    const result = await subscribeToNewsletter({ email, name })
    
    console.log("Newsletter subscription result:", result)
    
    if (!result.success) {
      console.error("Newsletter subscription failed:", result.error)
      return NextResponse.json({ error: result.error || "Failed to subscribe" }, { status: 400 })
    }

    console.log("Newsletter subscription successful")
    return NextResponse.json({ success: true, data: result.data }, { status: 200 })
  } catch (error: any) {
    console.error("Newsletter API error:", error)
    return NextResponse.json({ error: error?.message || "Unexpected error" }, { status: 500 })
  }
}






