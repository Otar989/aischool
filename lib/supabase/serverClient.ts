import { createClient } from "@supabase/supabase-js"

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!url || !serviceRole) throw new Error("Supabase admin env is missing")
  return createClient(url, serviceRole)
}
