import { NextRequest, NextResponse } from 'next/server'
import { verifyPromoJwt } from '@/lib/jwt'
import { signPromoJwt } from '@/lib/jwt'

export const runtime = 'nodejs'

// Автообновление promo_session, если осталось < 7 дней
export async function GET(req: NextRequest) {
  const token = req.cookies.get('promo_session')?.value
  if (!token) return NextResponse.json({ ok: false, reason: 'no-cookie' }, { status: 401 })
  try {
    const payload: any = await verifyPromoJwt(token)
    const now = Math.floor(Date.now() / 1000)
    const exp = payload.exp || 0
    const remaining = exp - now
    const sevenDays = 60 * 60 * 24 * 7

    if (remaining > sevenDays) {
      return NextResponse.json({ ok: true, refreshed: false, remainingSeconds: remaining })
    }

    // формируем новый payload без exp
    const { scope, exp: _, iat: __, ...rest } = payload
    const newJwt = await signPromoJwt(rest)
    const isLocal = (req.headers.get('host') || '').startsWith('localhost')
    const res = NextResponse.json({ ok: true, refreshed: true })
    res.cookies.set('promo_session', newJwt, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    return res
  } catch (e:any) {
    if (process.env.PROMO_DEBUG) console.error('[promo][refresh][fail]', e.message)
    return NextResponse.json({ ok: false, reason: 'verify-failed' }, { status: 401 })
  }
}
