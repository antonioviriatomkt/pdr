/**
 * One-time migration: wraps location.intro (string) and location.marketFraming (array)
 * into the multilingual object shape { en, pt } that the current schema expects.
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tyf7w7sh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

async function migrate() {
  const docs = await client.fetch<Array<{
    _id: string
    intro: unknown
    marketFraming: unknown
  }>>(`*[_type == "location"]{_id, intro, marketFraming}`)

  for (const doc of docs) {
    const patch = client.patch(doc._id)
    let needsPatch = false

    if (typeof doc.intro === 'string') {
      patch.set({ intro: { en: doc.intro, pt: '' } })
      needsPatch = true
      console.log(`[${doc._id}] intro: string → object`)
    }

    if (Array.isArray(doc.marketFraming)) {
      patch.set({ marketFraming: { en: doc.marketFraming, pt: [] } })
      needsPatch = true
      console.log(`[${doc._id}] marketFraming: array → object`)
    }

    if (needsPatch) {
      await patch.commit({ autoGenerateArrayKeys: true })
      console.log(`[${doc._id}] patched ✓`)
    }
  }

  console.log('Migration complete.')
}

migrate().catch((err) => { console.error(err); process.exit(1) })
