import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simple path-based middleware without external dependencies
  const { pathname } = request.nextUrl

  // Allow all requests to pass through for now
  // Add custom logic here if needed without importing supabase-js
  return
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
