import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  // Очистка cookie
  res.cookies.set('promo_session', '', { path: '/', httpOnly: true, maxAge: 0, sameSite: 'strict' })
  return res
}
