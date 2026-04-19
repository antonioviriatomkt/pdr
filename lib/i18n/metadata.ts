export const locales = ['en', 'pt'] as const
export type Locale = typeof locales[number]

/**
 * Generates Next.js `alternates.languages` for a given path (without locale prefix).
 * @param path - e.g. '/developments/some-slug' or '' for home
 */
export function getAlternates(path: string) {
  return {
    canonical: `/en${path}`,
    languages: {
      'en': `/en${path}`,
      'pt': `/pt${path}`,
      'x-default': `/en${path}`,
    },
  }
}
