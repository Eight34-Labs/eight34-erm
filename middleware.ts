import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/training', '/leads']
const AUTH_PATHS = ['/login']
const SESSION_COOKIE = 'e34_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path))
  const isRoot = pathname === '/'

  // Root redirect
  if (isRoot) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated user on auth pages → dashboard
  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protected routes require session
  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
