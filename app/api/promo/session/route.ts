import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('promo_session')?.value
  if (!token) return NextResponse.json({ ok: false, reason: 'no-cookie' }, { status: 401 })
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'undefined')
    const { payload } = await jwtVerify(token, secret)
    if ((payload as any).scope !== 'promo') throw new Error('bad-scope')
    return NextResponse.json({ ok: true, payload })
  } catch (e:any) {
    return NextResponse.json({ ok: false, reason: e.message }, { status: 401 })
  }
}
