export const locales = ['en', 'pt'] as const
export type Locale = typeof locales[number]

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

/**
 * Generates Next.js `alternates` for a given path (without locale prefix).
 * Uses absolute URLs so canonical and hreflang are spec-compliant for crawlers.
 * @param path - e.g. '/developments/some-slug' or '' for home
 */
export function getAlternates(path: string) {
  return {
    canonical: `${BASE}/en${path}`,
    languages: {
      en: `${BASE}/en${path}`,
      pt: `${BASE}/pt${path}`,
      'x-default': `${BASE}/en${path}`,
    },
  }
}
