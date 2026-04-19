// Pure type re-export — safe to import in client components (no runtime cost).
// The actual dictionary loading is server-only via getDictionary() in index.ts.
import type enJson from './en.json'

export type Dictionary = typeof enJson
export type Locale = 'en' | 'pt'
