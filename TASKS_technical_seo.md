# Portugal Developments Review — Technical SEO Tasks

Derived from the full technical SEO audit. Ordered by impact. Each task is self-contained.

---

## Critical (blocks indexation)

### SEO-01 — Fix self-referencing canonical per locale
**File:** `lib/i18n/metadata.ts`
- Change `getAlternates(path)` to accept a second `locale` param
- Set `canonical` to `${BASE}/${locale}${path}` instead of always `/en${path}`
- Update every call site: `getAlternates('/developments', lang)` etc.

### SEO-02 — Correct hreflang language codes and html[lang]
**Files:** `lib/i18n/metadata.ts`, `app/[lang]/layout.tsx`
- Change hreflang keys from `en` / `pt` to `en` / `pt-PT`
- Keep `x-default` pointing to `/en${path}`
- Change `<html lang={lang}>` to emit `pt-PT` when lang is `pt` (map in layout)

### SEO-03 — Localize metadata on static-export pages
**Files:** `app/[lang]/(main)/developments/page.tsx`, `app/[lang]/(main)/journal/page.tsx`, `app/[lang]/(main)/locations/[slug]/page.tsx`
- Convert static `export const metadata` to `generateMetadata({ params })`
- Pull title/description strings from `getDictionary(lang)` via a new `dict.seo.*` namespace
- Add `seo.developments`, `seo.journal`, `seo.locations` keys to `lib/i18n/en.json` and `lib/i18n/pt.json`

### SEO-04 — Add metadataBase to root layout
**File:** `app/[lang]/layout.tsx`
- Add `metadataBase: new URL(BASE_URL)` inside the `metadata` export so OG image URLs are absolute

---

## High (structured data & rich results)

### SEO-05 — Replace RealEstateListing with Residence + nested Offer
**File:** `app/[lang]/(main)/developments/[slug]/page.tsx`
- Change `@type` from `RealEstateListing` to `["Residence", "Product"]` (or `Apartment` / `House` when `dev.type` maps cleanly)
- Nest price inside an `offers` object: `{ "@type": "Offer", price, priceCurrency, availability, url }`
- Remove bare `price` and `availability` from the root object

### SEO-06 — Add Article JSON-LD to journal article pages
**File:** `app/[lang]/(main)/journal/article/[slug]/page.tsx`
- Build and inject an `Article` schema: `headline`, `author` (PDR editorial), `publisher` (org), `datePublished`, `dateModified`, `image`, `mainEntityOfPage`
- Wire `publishedAt` and `updatedAt` from article data

### SEO-07 — Add Place JSON-LD + BreadcrumbList to location pages
**File:** `app/[lang]/(main)/locations/[slug]/page.tsx`
- Add `Place` schema with `name`, `description` (loc.intro), `containedInPlace: { "@type": "Country", name: "Portugal" }`, `image`
- Add lat/long fields (`geo: { "@type": "GeoCoordinates" }`) — add `latitude` + `longitude` to `sanity/schemas/location.ts`
- Add `BreadcrumbList`: Home → Locations → {loc.name}
- Import and use `<JsonLd>` component

### SEO-08 — Add ItemList schema to listing pages
**Files:** `app/[lang]/(main)/developments/page.tsx`, `app/[lang]/(main)/locations/[slug]/page.tsx`
- Emit `ItemList` with `itemListElement` array of `ListItem` (position, name, url) for each visible development card

### SEO-09 — Add FAQPage schema to methodology and for-developers
**Files:** `app/[lang]/(main)/methodology/page.tsx`, `app/[lang]/(main)/for-developers/page.tsx`
- Define 3–5 Q&A pairs per page in the CMS or as hard-coded content
- Emit `FAQPage` JSON-LD wrapping each pair as `Question` + `acceptedAnswer`

### SEO-10 — Add og:locale and og:locale:alternate tags
**File:** `lib/i18n/metadata.ts` or individual `generateMetadata` calls
- Add `openGraph.locale` (`en_GB` / `pt_PT`) to each page's metadata
- Add `openGraph.alternateLocale` with the other locale's code

---

## High (URL structure & linking)

### SEO-11 — Flatten journal article URL: remove /article/ segment
**Steps:**
1. Add `app/[lang]/(main)/journal/[slug]/page.tsx` that re-exports the current article page logic
2. Set up a 301 redirect from `/[lang]/journal/article/[slug]` → `/[lang]/journal/[slug]` in `next.config.ts`
3. Update all internal links (`ArticleCard`, journal index, location page sidebar) to use the new path
4. Update `lib/i18n/metadata.ts` `getAlternates` calls that reference `/journal/article/`
5. Update `app/sitemap.ts` article URL generation

### SEO-12 — Add /locations to sitemap
**File:** `app/sitemap.ts`
- Add `{ path: '/locations', priority: 0.8, changeFrequency: 'weekly' }` to `staticRoutes`

### SEO-13 — Confirm /coming-soon is noindex and blocked in robots
**Files:** `app/coming-soon/`, `app/robots.ts`
- Verify `app/coming-soon/page.tsx` exports `robots: { index: false, follow: false }` in metadata
- Add `/coming-soon` to the `disallow` list in `robots.ts`

### SEO-14 — Add noindex field to location, journalArticle, and developer schemas
**Files:** `sanity/schemas/location.ts`, `sanity/schemas/journalArticle.ts`, `sanity/schemas/developer.ts`
- Copy the `noindex` field pattern from `sanity/schemas/development.ts` to each schema
- Wire the field in each page's `generateMetadata` to conditionally set `robots: { index: false, follow: false }`

---

## Medium (content gaps & internal linking)

### SEO-15 — Ship /developers/[slug] pages
**Steps:**
1. Add `app/[lang]/(main)/developers/[slug]/page.tsx` with developer bio + projects grid
2. Add `app/[lang]/(main)/developers/page.tsx` as a developer directory
3. Add `generateMetadata` with developer name + "Portugal property developer"
4. Add `Organization` JSON-LD for each developer
5. Link from development detail page (developer section) to their profile
6. Add "Developers" link to footer; add to sitemap

### SEO-16 — Build lifestyle-tag facet landing pages
**Steps:**
1. Create `app/[lang]/(main)/developments/[tag]/page.tsx` (or a curated whitelist route)
2. Define whitelisted tag slugs: `golf`, `beachfront`, `marina`, `branded-residences`, `investment-grade`
3. Render filtered developments + editorial intro pulled from Sanity (add `tagPage` content type or reuse `siteSettings`)
4. Add `BreadcrumbList`: Home → Developments → {Tag}
5. Interlink from development detail lifestyle tags → facet page
6. Add to sitemap

### SEO-17 — Add location sub-page links to journal category
**File:** `app/[lang]/(main)/locations/[slug]/page.tsx`
- Below the journal section, add a "More stories about {location}" link to `/journal/category/area-guides` (or the pre-generated `/journal/area-guides/{location}` once SEO-11 is done)

### SEO-18 — Add "Explore by Location" link from homepage to /locations
**File:** `app/[lang]/(main)/page.tsx`
- In the location quick-nav section, add an explicit "All locations →" link pointing to `/{lang}/locations`

---

## Medium (performance / Core Web Vitals)

### SEO-19 — Lazy-load brochure iframe and reserve height
**File:** `app/[lang]/(main)/developments/[slug]/page.tsx`
- Add `loading="lazy"` to the `<iframe>` at line ~210
- Gate it behind a `<details>` or a toggle button so it does not load on page entry
- Pre-reserve height with a min-height placeholder to prevent CLS on expansion

### SEO-20 — Server-render development grid; make filters URL-param driven
**Files:** `app/[lang]/(main)/developments/DevelopmentsIndex.tsx`, `app/[lang]/(main)/developments/page.tsx`
- Move the grid to a server component; pass pre-filtered `developments` from `page.tsx` based on `searchParams`
- Keep only the `<select>` controls as a thin client component that pushes `router.replace` with new params
- Add `canonical` pointing to the unfiltered listing for parameterized URLs; for whitelisted facet combos (SEO-16) point canonical to the facet page instead

### SEO-21 — Correct image sizes prop on DevelopmentCard
**File:** `components/DevelopmentCard.tsx`
- Set `sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"` on the hero image
- Verify ArticleCard has equivalent sizes set

### SEO-22 — Move inline media-query style blocks to globals.css
**Files:** `app/[lang]/(main)/page.tsx`, `components/Header.tsx`, and others with injected `<style>` tags
- Extract all `<style>{` ... `}</style>` blocks and corresponding class names into `app/globals.css`
- Remove the `<style>` tags from JSX to avoid post-hydration layout shifts

---

## Low (indexation hygiene)

### SEO-23 — Drive sitemap journal categories from CMS
**File:** `app/sitemap.ts`
- Replace the hard-coded `ARTICLE_CATEGORIES` array with a GROQ query: `array::unique(*[_type=="journalArticle"].category)`
- Only emit category pages that have ≥ 1 published article

### SEO-24 — Proxy PDF brochures and set X-Robots-Tag: noindex
**Steps:**
1. Create `app/api/brochure/[id]/route.ts` that fetches the PDF from Sanity asset URL and pipes it through with header `X-Robots-Tag: noindex, nofollow`
2. Update the `brochureUrl` field reference in the development detail page to use this proxy endpoint
3. Alternatively: replace the embedded iframe with a download link and add `rel="nofollow"` to the direct Sanity asset URL

### SEO-25 — Add pagination to /journal with canonical self-refs
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
- [ ] Canonical is self-referencing (locale-specific)
- [ ] hreflang covers both `en` and `pt-PT` with `x-default`
- [ ] `<title>` and `<meta description>` are in the correct locale language
- [ ] At least one valid JSON-LD block is present and passes Google's Rich Results Test
- [ ] No thin/empty category or facet pages in the sitemap
- [ ] `metadataBase` is set so OG images resolve as absolute URLs
