import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { logger } from "@/lib/logger"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export function createClient() {
  if (!isSupabaseConfigured) {
    logger.error("[v0] Supabase environment variables are not configured properly")
    throw new Error("Supabase is not configured. Please check your environment variables.")
  }

  try {
    return createClientComponentClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    })
  } catch (error) {
    logger.error({ err: error }, "[v0] Error creating Supabase client")
    throw error
  }
}

// Keep backward compatibility with singleton export
export const supabase = createClient()
