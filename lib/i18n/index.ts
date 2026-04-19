import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((m) => m.default),
  pt: () => import('./pt.json').then((m) => m.default),
}

export type Locale = keyof typeof dictionaries

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
