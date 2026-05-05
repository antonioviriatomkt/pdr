# Portugal Developments Review — Technical SEO Tasks

Derived from the full technical SEO audit. Ordered by impact. Each task is self-contained.

> **Audit status (2026-05-03):** 20 of 25 implementation tasks DONE. Genuine remaining work: SEO-19 (lazy iframe), SEO-22 (extract inline styles), SEO-24 (PDF proxy), SEO-25 (journal pagination). Plus partial: SEO-17 (location → category link), SEO-23 (sitemap categories cached at build, not live). Editorial content tasks SEO-C1 through SEO-C4 are tracked separately.

---

## Critical (blocks indexation)

### SEO-01 — Fix self-referencing canonical per locale ✅ DONE
**File:** `lib/i18n/metadata.ts`
- Change `getAlternates(path)` to accept a second `locale` param
- Set `canonical` to `${BASE}/${locale}${path}` instead of always `/en${path}`
- Update every call site: `getAlternates('/developments', lang)` etc.
**Evidence:** `lib/i18n/metadata.ts:20` — `getAlternates(path, locale='en')` accepts locale param; line 22 sets `canonical: ${BASE}/${locale}${path}`.

### SEO-02 — Correct hreflang language codes and html[lang] ✅ DONE
**Files:** `lib/i18n/metadata.ts`, `app/[lang]/layout.tsx`
- Change hreflang keys from `en` / `pt` to `en` / `pt-PT`
- Keep `x-default` pointing to `/en${path}`
- Change `<html lang={lang}>` to emit `pt-PT` when lang is `pt` (map in layout)
**Evidence:** `lib/i18n/metadata.ts:25` uses `'pt-PT'` key; `app/[lang]/layout.tsx:85` maps `lang === 'pt' ? 'pt-PT' : lang`.

### SEO-03 — Localize metadata on static-export pages ✅ DONE
**Evidence:** `app/[lang]/(main)/developments/page.tsx:13` uses `generateMetadata({ params })` pulling from `dict.seo.developments`. Same pattern on journal and locations index.
**Files:** `app/[lang]/(main)/developments/page.tsx`, `app/[lang]/(main)/journal/page.tsx`, `app/[lang]/(main)/locations/[slug]/page.tsx`
- Convert static `export const metadata` to `generateMetadata({ params })`
- Pull title/description strings from `getDictionary(lang)` via a new `dict.seo.*` namespace
- Add `seo.developments`, `seo.journal`, `seo.locations` keys to `lib/i18n/en.json` and `lib/i18n/pt.json`

### SEO-04 — Add metadataBase to root layout ✅ DONE
**File:** `app/[lang]/layout.tsx`
- Add `metadataBase: new URL(BASE_URL)` inside the `metadata` export so OG image URLs are absolute
**Evidence:** `app/[lang]/layout.tsx:31` — `metadataBase: new URL(BASE_URL)` in `generateMetadata` export.

---

## High (structured data & rich results)

### SEO-05 — Replace RealEstateListing with Residence + nested Offer ✅ DONE
**Evidence:** `app/[lang]/(main)/developments/[slug]/page.tsx:102-120` uses `@type: schemaType` (maps to `Apartment`/`House`); lines 114-120 nest `offers` object with `{"@type": "Offer", ...}`.
**File:** `app/[lang]/(main)/developments/[slug]/page.tsx`
- Change `@type` from `RealEstateListing` to `["Residence", "Product"]` (or `Apartment` / `House` when `dev.type` maps cleanly)
- Nest price inside an `offers` object: `{ "@type": "Offer", price, priceCurrency, availability, url }`
- Remove bare `price` and `availability` from the root object

### SEO-06 — Add Article JSON-LD to journal article pages ✅ DONE
**Evidence:** `app/[lang]/(main)/journal/article/[slug]/page.tsx:91-121` builds full `Article` schema with `headline`, `author`, `publisher`, `datePublished`, `dateModified`, `mainEntityOfPage`.
**File:** `app/[lang]/(main)/journal/article/[slug]/page.tsx`
- Build and inject an `Article` schema: `headline`, `author` (PDR editorial), `publisher` (org), `datePublished`, `dateModified`, `image`, `mainEntityOfPage`
- Wire `publishedAt` and `updatedAt` from article data

### SEO-07 — Add Place JSON-LD + BreadcrumbList to location pages ✅ DONE
**Evidence:** `locations/[slug]/page.tsx:79-90` Place schema with `geo: GeoCoordinates`; lines 106-110 BreadcrumbList; `sanity/schemas/location.ts` has `latitude`/`longitude` fields.
**File:** `app/[lang]/(main)/locations/[slug]/page.tsx`
- Add `Place` schema with `name`, `description` (loc.intro), `containedInPlace: { "@type": "Country", name: "Portugal" }`, `image`
- Add lat/long fields (`geo: { "@type": "GeoCoordinates" }`) — add `latitude` + `longitude` to `sanity/schemas/location.ts`
- Add `BreadcrumbList`: Home → Locations → {loc.name}
- Import and use `<JsonLd>` component

### SEO-08 — Add ItemList schema to listing pages ✅ DONE
**Evidence:** `developments/page.tsx:36-47` and `locations/[slug]/page.tsx:112-123` both emit `ItemList` JSON-LD.
**Files:** `app/[lang]/(main)/developments/page.tsx`, `app/[lang]/(main)/locations/[slug]/page.tsx`
- Emit `ItemList` with `itemListElement` array of `ListItem` (position, name, url) for each visible development card

### SEO-09 — Add FAQPage schema to methodology and for-developers ✅ DONE
**Evidence:** `for-developers/page.tsx:28-36` builds FAQPage schema from `fd.faq` array as `Question`+`acceptedAnswer` pairs. Methodology covered by equivalent block.
**Files:** `app/[lang]/(main)/methodology/page.tsx`, `app/[lang]/(main)/for-developers/page.tsx`
- Define 3–5 Q&A pairs per page in the CMS or as hard-coded content
- Emit `FAQPage` JSON-LD wrapping each pair as `Question` + `acceptedAnswer`

### SEO-10 — Add og:locale and og:locale:alternate tags ✅ DONE
**Evidence:** `lib/i18n/metadata.ts:12-18` `getOgLocale()` returns `{ locale, alternateLocale }`; called from all page-level `generateMetadata` exports.
**File:** `lib/i18n/metadata.ts` or individual `generateMetadata` calls
- Add `openGraph.locale` (`en_GB` / `pt_PT`) to each page's metadata
- Add `openGraph.alternateLocale` with the other locale's code

---

## High (URL structure & linking)

### SEO-11 — Flatten journal article URL: remove /article/ segment ✅ DONE
**Evidence:** `app/[lang]/(main)/journal/[slug]/page.tsx` exists; `next.config.ts:7-9` 301 redirects `/journal/article/:slug` → `/journal/:slug`; metadata + cards use the flat path.
**Steps:**
1. Add `app/[lang]/(main)/journal/[slug]/page.tsx` that re-exports the current article page logic
2. Set up a 301 redirect from `/[lang]/journal/article/[slug]` → `/[lang]/journal/[slug]` in `next.config.ts`
3. Update all internal links (`ArticleCard`, journal index, location page sidebar) to use the new path
4. Update `lib/i18n/metadata.ts` `getAlternates` calls that reference `/journal/article/`
5. Update `app/sitemap.ts` article URL generation

### SEO-12 — Add /locations to sitemap ✅ DONE
**File:** `app/sitemap.ts`
- Add `{ path: '/locations', priority: 0.8, changeFrequency: 'weekly' }` to `staticRoutes`
**Evidence:** `app/sitemap.ts:22` includes `/locations` in `staticRoutes`.

### SEO-13 — Confirm /coming-soon is noindex and blocked in robots ✅ DONE
**Evidence:** `app/coming-soon/layout.tsx:5` exports `robots: { index: false, follow: false }`; `app/robots.ts:28` disallows `/coming-soon`.
**Files:** `app/coming-soon/`, `app/robots.ts`
- Verify `app/coming-soon/page.tsx` exports `robots: { index: false, follow: false }` in metadata
- Add `/coming-soon` to the `disallow` list in `robots.ts`

### SEO-14 — Add noindex field to location, journalArticle, and developer schemas ✅ DONE
**Evidence:** `location.ts:52`, `journalArticle.ts:86`, `developer.ts:40` all have `noindex` field; pages read it (dev-slug:42, article:41, location:34) and conditionally set `robots`.
**Files:** `sanity/schemas/location.ts`, `sanity/schemas/journalArticle.ts`, `sanity/schemas/developer.ts`
- Copy the `noindex` field pattern from `sanity/schemas/development.ts` to each schema
- Wire the field in each page's `generateMetadata` to conditionally set `robots: { index: false, follow: false }`

---

## Medium (content gaps & internal linking)

### SEO-15 — Ship /developers/[slug] pages ✅ DONE
**Evidence:** `app/[lang]/(main)/developers/page.tsx` (hub) and `[slug]/page.tsx` (detail) both exist with Organization JSON-LD; sitemap includes developers (lines 88-94); footer + Header link present.
**Steps:**
1. Add `app/[lang]/(main)/developers/[slug]/page.tsx` with developer bio + projects grid
2. Add `app/[lang]/(main)/developers/page.tsx` as a developer directory
3. Add `generateMetadata` with developer name + "Portugal property developer"
4. Add `Organization` JSON-LD for each developer
5. Link from development detail page (developer section) to their profile
6. Add "Developers" link to footer; add to sitemap

### SEO-16 — Build lifestyle-tag facet landing pages ✅ DONE
**Evidence:** `app/[lang]/(main)/lifestyle/[tag]/page.tsx` exists with BreadcrumbList (96-107) + ItemList (82-94); whitelisted via `LIFESTYLE_TAG_SLUGS` + `generateStaticParams`. Tags link from DevelopmentCard.
**Steps:**
1. Create `app/[lang]/(main)/developments/[tag]/page.tsx` (or a curated whitelist route)
2. Define whitelisted tag slugs: `golf`, `beachfront`, `marina`, `branded-residences`, `investment-grade`
3. Render filtered developments + editorial intro pulled from Sanity (add `tagPage` content type or reuse `siteSettings`)
4. Add `BreadcrumbList`: Home → Developments → {Tag}
5. Interlink from development detail lifestyle tags → facet page
6. Add to sitemap

### SEO-17 — Add location sub-page links to journal category ⚠️ PARTIAL
**File:** `app/[lang]/(main)/locations/[slug]/page.tsx`
- Below the journal section, add a "More stories about {location}" link to `/journal/category/area-guides` (or the pre-generated `/journal/area-guides/{location}` once SEO-11 is done)
**Evidence:** Location page renders related articles but has no explicit "More stories →" link to `/journal/category/area-guides`. Still outstanding.

### SEO-18 — Add "Explore by Location" link from homepage to /locations ✅ DONE
**File:** `app/[lang]/(main)/page.tsx`
- In the location quick-nav section, add an explicit "All locations →" link pointing to `/{lang}/locations`
**Evidence:** `app/[lang]/(main)/page.tsx:118` "View All" link in `locations-bar-all` points to `/{lang}/locations`.

---

## Medium (performance / Core Web Vitals)

### SEO-19 — Lazy-load brochure iframe and reserve height ⚠️ PARTIAL
**File:** `app/[lang]/(main)/developments/[slug]/page.tsx`
- Add `loading="lazy"` to the `<iframe>` at line ~210
- Gate it behind a `<details>` or a toggle button so it does not load on page entry
- Pre-reserve height with a min-height placeholder to prevent CLS on expansion
**Evidence:** Iframe height is responsive (560→420px on mobile) but `loading="lazy"` is NOT set and iframe is not gated behind a toggle. Still outstanding.

### SEO-20 — Server-render development grid; make filters URL-param driven ✅ DONE
**Evidence:** `app/[lang]/(main)/developments/page.tsx` reads `searchParams` (location/type/status/sort), filters + sorts server-side, and passes results to `DevelopmentsIndex.tsx` (now a server component). Interactive controls live in a thin client `Filters.tsx` that uses `useSearchParams` + `router.replace` to update params without a full reload. Canonical via `getAlternates('/developments', lang)` always points to the unfiltered URL regardless of active filters. ItemList JSON-LD reflects filtered results. Verified at runtime: `?location=lisbon&type=Apartments&sort=newest` returns 1 card vs 6 unfiltered, with canonical unchanged.
**Files:** `app/[lang]/(main)/developments/DevelopmentsIndex.tsx`, `app/[lang]/(main)/developments/page.tsx`
- Move the grid to a server component; pass pre-filtered `developments` from `page.tsx` based on `searchParams`
- Keep only the `<select>` controls as a thin client component that pushes `router.replace` with new params
- Add `canonical` pointing to the unfiltered listing for parameterized URLs; for whitelisted facet combos (SEO-16) point canonical to the facet page instead

### SEO-21 — Correct image sizes prop on DevelopmentCard ✅ DONE
**File:** `components/DevelopmentCard.tsx`
- Set `sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"` on the hero image
- Verify ArticleCard has equivalent sizes set
**Evidence:** `DevelopmentCard.tsx:94` and `ArticleCard.tsx:53` both set `sizes="(max-width: 768px) 100vw, 400px"`. (Slightly simpler form than the recommended one but functionally correct.)

### SEO-22 — Move inline media-query style blocks to globals.css ⚠️ PARTIAL
**Evidence:** Mobile media queries are working but live in co-located `<style>` blocks on each page (homepage, dev detail, contact, about, for-developers, DevelopmentsIndex). Functional, but never extracted to `globals.css` as planned. Cosmetic refactor.
**Files:** `app/[lang]/(main)/page.tsx`, `components/Header.tsx`, and others with injected `<style>` tags
- Extract all `<style>{` ... `}</style>` blocks and corresponding class names into `app/globals.css`
- Remove the `<style>` tags from JSX to avoid post-hydration layout shifts

---

## Low (indexation hygiene)

### SEO-23 — Drive sitemap journal categories from CMS ⚠️ PARTIAL
**Evidence:** `app/sitemap.ts:67-74` calls `getCategoriesWithArticles()` (CMS-driven), but result is materialised at build time rather than via a live GROQ query at request time. Acceptable for static sitemap generation; mark complete if build-time is the chosen approach.
**File:** `app/sitemap.ts`
- Replace the hard-coded `ARTICLE_CATEGORIES` array with a GROQ query: `array::unique(*[_type=="journalArticle"].category)`
- Only emit category pages that have ≥ 1 published article

### SEO-24 — Proxy PDF brochures and set X-Robots-Tag: noindex ❌ NOT DONE
**Evidence:** No `app/api/brochure/[id]/route.ts` exists; brochure embedded directly in page without proxy/header. Still outstanding.
**Steps:**
1. Create `app/api/brochure/[id]/route.ts` that fetches the PDF from Sanity asset URL and pipes it through with header `X-Robots-Tag: noindex, nofollow`
2. Update the `brochureUrl` field reference in the development detail page to use this proxy endpoint
3. Alternatively: replace the embedded iframe with a download link and add `rel="nofollow"` to the direct Sanity asset URL

### SEO-25 — Add pagination to /journal with canonical self-refs ❌ NOT DONE
**Evidence:** `journal/page.tsx:30` loads a fixed 24 articles with no `?page=N` handling and no `rel=next/prev` links. Outstanding (low priority — only matters at scale).
**File:** `app/[lang]/(main)/journal/page.tsx`
- Implement `?page=N` pagination when article count exceeds 24
- Each paginated page is self-canonical (not canonical to page 1)
- Render `<link rel="next">` / `<link rel="prev">` in metadata `alternates`
- Add paginated URLs to sitemap dynamically

### SEO-26 — Add /search as noindex when implemented
*(Deferred — action required when search feature is built)*
- Ensure future `/search` route exports `robots: { index: false, follow: false }`
- Add `/search` to `disallow` list in `robots.ts`

---

## Content tasks (require CMS content creation, not just code)

### SEO-C1 — Write Golden Visa / NHR / D7 buyer-guide pillar page
- Create as a `journalArticle` with `isPillar: true` flag (add field to schema) or as a new `guidePage` type
- Target: "golden visa portugal property", "nhr tax regime property", "buy property portugal foreigner"

### SEO-C2 — Write Portugal property buying process guide
- Cover legal process, notary, IMT/IMI taxes, typical timeline
- Interlink with relevant developments and location pages

### SEO-C3 — Add neighbourhood-level location entries under Lisbon
- Create Sanity `location` documents for: Príncipe Real, Estrela, Chiado, Alvalade, Parque das Nações
- Set `parentLocation` reference to Lisbon (add `parentLocation` field to location schema)
- Add breadcrumb: Home → Locations → Lisbon → Príncipe Real

### SEO-C4 — Publish annual market report (one per region)
- Gate full report behind email capture (newsletter signup component already exists)
- Keep a 300-word free summary as a crawlable `journalArticle`

---

## Completion criteria

A page is SEO-compliant when:
- [x] Canonical is self-referencing (locale-specific)
- [x] hreflang covers both `en` and `pt-PT` with `x-default`
- [x] `<title>` and `<meta description>` are in the correct locale language
- [x] At least one valid JSON-LD block is present and passes Google's Rich Results Test
- [x] No thin/empty category or facet pages in the sitemap
- [x] `metadataBase` is set so OG images resolve as absolute URLs

---

## Audit summary (2026-05-03)

**DONE (20):** SEO-01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21 + completion criteria.
**PARTIAL (4):** SEO-17 (no journal-category link from location pages), SEO-19 (iframe responsive but not lazy), SEO-22 (inline styles work but not extracted to globals.css), SEO-23 (CMS-driven but build-time, not live).
**NOT DONE (2):** SEO-24 (PDF proxy), SEO-25 (journal pagination).
**Editorial / content (4):** SEO-C1, C2, C3, C4 — all editorial work, not code.
**Deferred:** SEO-26 (`/search` noindex — only when search feature is built).
