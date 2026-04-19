import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'pt'] as const
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().startsWith(locale)) return locale
    // Match e.g. "pt-BR" → "pt"
    if (acceptLanguage.toLowerCase().includes(`${locale}-`) || acceptLanguage.toLowerCase().includes(`,${locale}`)) return locale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is already a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect to add locale prefix
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip _next internals, API routes, studio, and static files
    '/((?!_next|api|studio|favicon\\.ico|.*\\..*).*)',
  ],
}
