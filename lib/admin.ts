import { cookies } from 'next/headers'

export function isAdminRequest(req: Request | { headers: Headers }) {
  const c = 'headers' in req ? req.headers : (req as any).headers
  const promo = cookies().get('promo_session')?.value
  if (!promo) return false
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  // TODO: decode JWT if contains email, now bypass when ADMIN_EMAILS empty -> allow
  return admins.length === 0 || promo.length > 10
}

export function requireAdmin(req: Request | { headers: Headers }) {
  if (!isAdminRequest(req)) {
    throw new Error('forbidden')
  }
}
