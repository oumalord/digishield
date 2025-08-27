"use client"

import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import { useEffect, useState } from "react"
import { supabase, hasValidConfig } from "@/lib/supabase"

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: string
  skills?: string[]
  availability?: string
  status: "pending" | "active" | "inactive"
  join_date?: string
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")

  const load = async () => {
    if (!hasValidConfig || !supabase) return
    const { data, error } = await supabase
      .from("volunteers")
      .select("id, name, email, phone, location, role, skills, availability, status, join_date")
      .order("join_date", { ascending: false })
      .limit(500)
    if (error) setError(error.message)
    else setVolunteers((data as any) || [])
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (v: Volunteer, status: Volunteer["status"]) => {
    if (!supabase) return
    const { error } = await supabase.from("volunteers").update({ status }).eq("id", v.id)
    if (error) setError(error.message)
    else load()
  }

  const filtered = volunteers.filter((v) =>
    (v.name + v.email + v.role + (v.skills || []).join(",")).toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen pt-4">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Volunteers</h1>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="mb-4">
            <input
              placeholder="Search by name, email, role or skills"
              className="w-full border px-3 py-2 rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            {filtered.map((v) => (
              <div key={v.id} className="border rounded p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{v.name} — <span className="text-sm font-normal text-gray-600">{v.role}</span></div>
                    <div className="text-sm text-gray-600">{v.email} • {v.phone} • {v.location}</div>
                    {v.skills && v.skills.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">Skills: {v.skills.join(", ")}</div>
                    )}
                    {v.availability && (
                      <div className="text-xs text-gray-600 mt-1">Availability: {v.availability}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{v.join_date ? new Date(v.join_date).toLocaleDateString() : ""}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 rounded bg-gray-100 text-xs">{v.status}</span>
                  <button onClick={() => updateStatus(v, "active")} className="btn-secondary">Activate</button>
                  <button onClick={() => updateStatus(v, "inactive")} className="px-3 py-2 border rounded">Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}


