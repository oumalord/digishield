"use client"

import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import { useEffect, useState } from "react"
import { supabase, hasValidConfig } from "@/lib/supabase"

type Team = { id: number; name: string; role: string; email?: string; is_active: boolean; bio?: string }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Team[]>([])
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    if (!hasValidConfig || !supabase) return
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, role, email, is_active, bio")
      .order("display_order", { ascending: true })
    if (error) setError(error.message)
    else setMembers((data as any) || [])
  }

  useEffect(() => {
    load()
  }, [])

  const clearForm = () => {
    setName("")
    setRole("")
    setEmail("")
    setBio("")
    setEditingId(null)
  }

  const save = async () => {
    if (!hasValidConfig || !supabase) return
    const payload = { name, role, email, bio, is_active: true }
    if (editingId) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editingId)
      if (error) setError(error.message)
      else {
        clearForm()
        load()
      }
    } else {
      const { error } = await supabase.from("team_members").insert([payload])
      if (error) setError(error.message)
      else {
        clearForm()
        load()
      }
    }
  }

  const edit = (m: Team) => {
    setEditingId(m.id)
    setName(m.name)
    setRole(m.role)
    setEmail(m.email || "")
    setBio(m.bio || "")
  }

  const remove = async (id: number) => {
    if (!hasValidConfig || !supabase) return
    const { error } = await supabase.from("team_members").delete().eq("id", id)
    if (error) setError(error.message)
    else load()
  }

  const toggleActive = async (id: number, current: boolean) => {
    if (!hasValidConfig || !supabase) return
    const { error } = await supabase.from("team_members").update({ is_active: !current }).eq("id", id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen pt-4">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Team Members</h1>
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Create / Edit Form */}
          <div className="p-4 border rounded space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border px-3 py-2 rounded" />
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="w-full border px-3 py-2 rounded" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded" />
              <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short Bio" className="w-full border px-3 py-2 rounded col-span-1 sm:col-span-2" />
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="btn-primary">{editingId ? "Update Member" : "Add Member"}</button>
              {editingId && (
                <button onClick={clearForm} className="btn-secondary">Cancel</button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2"/>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-3 py-2">{m.name}</td>
                    <td className="px-3 py-2">{m.role}</td>
                    <td className="px-3 py-2">{m.email || "-"}</td>
                    <td className="px-3 py-2">{m.is_active ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 space-x-2">
                      <button onClick={() => edit(m)} className="px-2 py-1 border rounded">Edit</button>
                      <button onClick={() => toggleActive(m.id, m.is_active)} className="px-2 py-1 border rounded">
                        {m.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => remove(m.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  )
}



