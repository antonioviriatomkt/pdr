export const locales = ['en', 'pt'] as const
export type Locale = typeof locales[number]

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

/**
 * Generates Next.js `alternates` for a given path (without locale prefix).
 * Uses absolute URLs so canonical and hreflang are spec-compliant for crawlers.
 * @param path - e.g. '/developments/some-slug' or '' for home
 * @param locale - the current locale; canonical points to this locale's URL
 */
const ogLocaleMap: Record<string, string> = { en: 'en_GB', pt: 'pt_PT' }

export function getOgLocale(locale: string) {
  const current = ogLocaleMap[locale] ?? 'en_GB'
  const alternate = Object.values(ogLocaleMap).filter((v) => v !== current)
  return { locale: current, alternateLocale: alternate }
}

export function getAlternates(path: string, locale: string = 'en') {
  return {
    canonical: `${BASE}/${locale}${path}`,
    languages: {
      en: `${BASE}/en${path}`,
      'pt-PT': `${BASE}/pt${path}`,
      'x-default': `${BASE}/en${path}`,
    },
  }
}
