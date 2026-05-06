import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Supabase v2 stores session in sb-<project-ref>-auth-token cookie
  const hasCookie = [...request.cookies.getAll()].some(
    (c) => c.name.includes('-auth-token') || c.name === 'sb-access-token'
  )

  if (!hasCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
