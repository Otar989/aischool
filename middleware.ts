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
  // Оставляем широкое покрытие, но исключаем системные файлы
  matcher: ['/((?!_next|static|images|favicon.ico|robots.txt|sitemap.xml).*)'],
}
