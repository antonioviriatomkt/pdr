import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COMING_SOON = false

const locales = ['en', 'pt'] as const
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().startsWith(locale)) return locale
    if (acceptLanguage.toLowerCase().includes(`${locale}-`) || acceptLanguage.toLowerCase().includes(`,${locale}`)) return locale
  }
  return defaultLocale
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (COMING_SOON) {
    if (pathname === '/coming-soon') return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = '/coming-soon'
    return NextResponse.redirect(url, 307)
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: [
    '/((?!_next|api|studio|favicon\\.ico|.*\\..*).*)',
  ],
}
