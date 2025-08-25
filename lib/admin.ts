import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

async function decodeEmail(token: string): Promise<string | null> {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return null
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return (payload as any).email || null
  } catch {
    return null
  }
}

export async function isAdminRequest(req: Request | { headers: Headers }) {
  const promo = cookies().get('promo_session')?.value
  if (!promo) return false
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  if (admins.length === 0) return true
  const email = await decodeEmail(promo)
  if (!email) return false
  return admins.includes(email)
}

export async function requireAdmin(req: Request | { headers: Headers }) {
  if (!(await isAdminRequest(req))) {
    throw new Error('forbidden')
  }
}
