import { NextRequest, NextResponse } from 'next/server'
import { verifyPromoJwt } from '@/lib/jwt'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('promo_session')?.value
  if (!token) return NextResponse.json({ ok: false, reason: 'no-cookie' }, { status: 401 })
  try {
    if (!process.env.JWT_SECRET) {
      // Мягкий режим: не валидируем подпись если секрет не задан (preview / dev)
      return NextResponse.json({ ok: true, payload: { scope: 'promo', unverified: true } })
    }
    const payload = await verifyPromoJwt(token)
    return NextResponse.json({ ok: true, payload })
  } catch (e:any) {
    if (process.env.PROMO_DEBUG) {
      console.error('[promo][session][verify-fail]', e.message)
    }
    return NextResponse.json({ ok: false, reason: e.message, debug: process.env.PROMO_DEBUG ? { tokenStart: token.slice(0,20) } : undefined }, { status: 401 })
  }
}
