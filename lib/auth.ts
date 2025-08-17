import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { logger } from "@/lib/logger"

export interface User {
  id: string
  email: string
  name?: string
  role: "USER" | "ADMIN" | "EDITOR" | "SUPPORT"
  avatar_url?: string
}

export async function getUser(): Promise<User | null> {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return null
    }

    // Get user profile from database
    const { data: profile } = await supabase
      .from("users")
      .select("id, email, name, role, avatar_url")
      .eq("id", session.user.id)
      .single()

    if (!profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role || "USER",
      avatar_url: profile.avatar_url,
    }
  } catch (error) {
    logger.error({ err: error }, "Error getting user")
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect("/")
  }
  return user
}
