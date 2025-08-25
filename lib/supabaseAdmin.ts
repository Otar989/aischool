import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Единая точка создания admin-клиента Supabase.
// Используем унифицированные имена переменных:
//  - NEXT_PUBLIC_SUPABASE_URL (публичный) или SUPABASE_URL (fallback)
//  - SUPABASE_SERVICE_ROLE_KEY (основной) или SUPABASE_SERVICE_ROLE (fallback / старое имя)
// Если переменные отсутствуют во время сборки (например, в preview без секретов) —
// не роняем build, а возвращаем «пустой» клиент-стаб, который даст контролируемые ошибки при обращении.

function createStubClient(): SupabaseClient {
  // Простейший заглушечный объект достаточный для наших вызовов .from(...).select/insert
  const handler = {
    get: () => () => handler,
  }
  return new Proxy({
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
      update: () => ({ eq: () => ({}) }),
      rpc: () => ({})
    })
  }, handler) as unknown as SupabaseClient
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE

let tmpClient: SupabaseClient
if (!url || !serviceRole) {
  console.error('[supabaseAdmin] Missing env vars: need NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE). Using stub client.')
  tmpClient = createStubClient()
} else {
  tmpClient = createClient(url, serviceRole, { auth: { persistSession: false } })
}

export const supabaseAdmin = tmpClient

