import { createBrowserClient } from "@supabase/ssr"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        if (typeof document !== "undefined") {
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(";").shift()
        }
        return undefined
      },
      set(name: string, value: string, options: any) {
        if (typeof document !== "undefined") {
          let cookieString = `${name}=${value}`
          if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`
          if (options?.path) cookieString += `; path=${options.path}`
          if (options?.domain) cookieString += `; domain=${options.domain}`
          if (options?.secure) cookieString += "; secure"
          if (options?.httpOnly) cookieString += "; httponly"
          if (options?.sameSite) cookieString += `; samesite=${options.sameSite}`
          document.cookie = cookieString
        }
      },
      remove(name: string, options: any) {
        if (typeof document !== "undefined") {
          this.set(name, "", { ...options, maxAge: 0 })
        }
      },
    },
  })
}

// Keep backward compatibility with singleton export
export const supabase = createClient()
