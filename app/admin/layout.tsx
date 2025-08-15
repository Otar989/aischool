import type React from "react"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  // Check if user is admin
  const adminResult = await query("SELECT role FROM users WHERE id = $1 AND role = 'admin'", [user.id])

  if (adminResult.rows.length === 0) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader user={user} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
