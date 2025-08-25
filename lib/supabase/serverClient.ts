import { createClient } from "@supabase/supabase-js"

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!url || !serviceRole) {
    // Вместо выброса исключения (который ломает build) логируем и возвращаем заглушку
    console.error('[supabase/serverClient] Missing env vars for admin client')
    return {
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
        update: () => ({ eq: () => ({}) }),
        rpc: () => ({})
      })
    } as any
  }
  return createClient(url, serviceRole)
}
