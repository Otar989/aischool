import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/promo') || pathname.startsWith('/legal')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('promo_session')?.value
  if (!token) return NextResponse.redirect(new URL('/promo', req.url))

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    if ((payload as any).scope !== 'promo') throw new Error('bad scope')
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/promo', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next|static|images|favicon.ico|robots.txt|sitemap.xml|legal/.*|promo).*)'],
}
