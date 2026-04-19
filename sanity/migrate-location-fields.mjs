/**
 * One-time data migration: wraps all multilingual fields that were stored
 * as plain strings/arrays into the {en, pt} object shape the schema expects.
 *
 * Covers: location (intro, marketFraming)
 *         development (editorialThesis, typologyNote, whyStandsOut, areaGuide)
 *         journalArticle (title, excerpt, body)
 *
 * Usage:
 *   SANITY_TOKEN=<your_token> node sanity/migrate-location-fields.mjs
 */

const PROJECT_ID = 'tyf7w7sh'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.env.SANITY_TOKEN

if (!TOKEN) {
  console.error('Error: SANITY_TOKEN env var is required.')
  console.error('Get one at: https://www.sanity.io/manage/personal/project/tyf7w7sh/api#tokens')
  process.exit(1)
}

const BASE = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`
const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }

async function query(groq) {
  const url = `${BASE}/query/${DATASET}?query=${encodeURIComponent(groq)}&perspective=raw`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`)
  return (await res.json()).result
}

async function mutate(mutations) {
  const res = await fetch(`${BASE}/mutate/${DATASET}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mutations }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${JSON.stringify(body)}`)
  return body
}

// Wraps a plain string into {en, pt:''}
function wrapText(val) {
  return typeof val === 'string' ? { en: val, pt: '' } : null
}

// Wraps a plain block array into {en: array, pt:[]}
function wrapBlocks(val) {
  return Array.isArray(val) ? { en: val, pt: [] } : null
}

function fixLocation(doc) {
  const set = {}
  if (typeof doc.intro === 'string')          set.intro = wrapText(doc.intro)
  if (Array.isArray(doc.marketFraming))       set.marketFraming = wrapBlocks(doc.marketFraming)
  return set
}

function fixDevelopment(doc) {
  const set = {}
  if (typeof doc.editorialThesis === 'string') set.editorialThesis = wrapText(doc.editorialThesis)
  if (typeof doc.typologyNote === 'string')    set.typologyNote    = wrapText(doc.typologyNote)
  if (Array.isArray(doc.whyStandsOut))         set.whyStandsOut    = wrapBlocks(doc.whyStandsOut)
  if (Array.isArray(doc.areaGuide))            set.areaGuide       = wrapBlocks(doc.areaGuide)
  return set
}

function fixJournalArticle(doc) {
  const set = {}
  if (typeof doc.title === 'string')   set.title   = wrapText(doc.title)
  if (typeof doc.excerpt === 'string') set.excerpt  = wrapText(doc.excerpt)
  if (Array.isArray(doc.body))         set.body     = wrapBlocks(doc.body)
  return set
}

const fixers = {
  location:       fixLocation,
  development:    fixDevelopment,
  journalArticle: fixJournalArticle,
}

async function migrate() {
  const docs = await query('*[_type in ["location","development","journalArticle"]]')
  console.log(`Found ${docs.length} document(s) to inspect\n`)

  const mutations = []

  for (const doc of docs) {
    const fixer = fixers[doc._type]
    if (!fixer) continue

    const label = doc._id.startsWith('drafts.') ? `[draft]` : `[published]`
    const name = doc.name ?? doc.title ?? doc._id
    console.log(`${label} ${doc._type} — ${name} (${doc._id})`)

    const set = fixer(doc)
    if (Object.keys(set).length === 0) {
      console.log(`  → already correct, skipping\n`)
      continue
    }

    for (const [field, val] of Object.entries(set)) {
      const from = Array.isArray(doc[field]) ? 'array' : typeof doc[field]
      console.log(`  ${field}: ${from} → {en, pt}`)
    }

    const { _createdAt, _updatedAt, _rev, _system, ...base } = doc
    mutations.push({ createOrReplace: { ...base, ...set } })
    console.log(`  → queued\n`)
  }

  if (mutations.length === 0) {
    console.log('Nothing to migrate — all documents already have the correct shape.')
    return
  }

  console.log(`Applying ${mutations.length} mutation(s)...`)
  const result = await mutate(mutations)
  console.log(`Done — patched ${result.results?.length ?? '?'} document(s).`)
}

migrate().catch(err => { console.error(err); process.exit(1) })
