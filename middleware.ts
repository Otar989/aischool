import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Публичные маршруты (маркетинг / аутентификация) — не требуем промо токен
  const publicPrefixes = [
    '/',
    '/promo',
    '/legal',
    '/pricing',
    '/about',
    '/contacts',
    '/login',
    '/register',
    '/forgot-password',
    '/api/health'
  ]
  const isPublic = publicPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (isPublic) return NextResponse.next()

  // Префиксы, которые должны быть защищены промо-доступом
  const protectedPrefixes = ['/courses', '/start', '/dashboard', '/learn', '/admin', '/profile', '/api/ai', '/api/lessons']
  const needsGate = protectedPrefixes.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (!needsGate) return NextResponse.next()

  const token = req.cookies.get('promo_session')?.value
  if (!token) return NextResponse.redirect(new URL('/promo', req.url))

  const relax = process.env.PROMO_RELAX === '1'
  if (relax) {
    if (process.env.PROMO_DEBUG) console.warn('[promo][middleware] RELAX mode ON: skipping signature verify')
    return NextResponse.next()
  }

  const strict = process.env.PROMO_STRICT === '1'
  if (!strict) {
    // Мягкий режим: наличие cookie достаточно
    if (process.env.PROMO_DEBUG) console.warn('[promo][middleware] soft mode pass')
    return NextResponse.next()
  }

  try {
    const secretStr = process.env.JWT_SECRET
    if (!secretStr) {
      if (process.env.PROMO_DEBUG) console.error('[promo][middleware] Missing JWT_SECRET; allowing pass (strict off)')
      return NextResponse.next()
    }
    const secret = new TextEncoder().encode(secretStr)
    const { payload } = await jwtVerify(token, secret)
    if ((payload as any).scope !== 'promo') throw new Error('bad scope')
    return NextResponse.next()
  } catch (e: any) {
    if (process.env.PROMO_DEBUG) console.error('[promo][middleware][verify-fail]', e.message, 'token.head=', token.split('.')[0])
    const url = new URL('/promo', req.url)
    url.searchParams.set('e', 'auth')
    return NextResponse.redirect(url)
  }
}

export const config = {
  // Оставляем широкое покрытие, но исключаем системные файлы
  matcher: ['/((?!_next|static|images|favicon.ico|robots.txt|sitemap.xml).*)'],
}
