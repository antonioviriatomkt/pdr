# Portugal Developments Review — Content SEO Implementation Tasks

> **Purpose:** Implement the 7 content SEO gaps identified in the April 2026 audit. Each gap is self-contained with schema changes, route work, content briefs, and acceptance criteria. Tasks are ordered by commercial priority within each gap.
>
> **Before starting:**
> - Read `docs/design-language.md` — every new page must match the visual system.
> - Read `AGENTS.md` — this is Next.js 16 with breaking changes; check `node_modules/next/dist/docs/` for any API you haven't used recently.
> - All new content must be bilingual (EN + PT). Localised fields follow the existing `{ en: '...', pt: '...' }` object pattern used in `sanity/schemas/journalArticle.ts`.
> - All new pages must emit `hreflang` via `getAlternates()` from `lib/i18n/metadata.ts` and self-referencing canonicals (fix from the technical audit — see `TASKS_SEO.md` if separate).
> - Do **not** introduce new colors, animations, gradients, or shadows. No component should deviate from the design language doc.

---

## Gap 1 — Buyer Journey Entry Points

**Goal:** Capture top-of-funnel queries from international buyers by publishing three evergreen pillar pages that anchor the buying process.

### 1.1 — Add `buyer-guides` category to the journal

- [x] In `sanity/schemas/journalArticle.ts`, add `{ title: 'Buyer Guides', value: 'buyer-guides' }` to the `category` field's options list.
- [x] Add `buyerGuides: 'Buyer Guides'` key to `lib/i18n/en.json` under `journal.categories`.
- [x] Add Portuguese equivalent (`'Guias de Compra'`) to `lib/i18n/pt.json` under `journal.categories`.
- [x] Add `'buyer-guides'` to the `ARTICLE_CATEGORIES` array in `app/sitemap.ts`.

### 1.2 — Add `isPillar` flag to journal articles

- [x] In `sanity/schemas/journalArticle.ts`, add:
  ```ts
  defineField({
    name: 'isPillar',
    title: 'Pillar Content',
    type: 'boolean',
    description: 'Cornerstone evergreen content. Displayed prominently on the journal index and linked from development detail pages.',
    initialValue: false,
  }),
  ```
- [x] Extend `lib/queries.ts` with a `getPillarArticles(lang)` function that returns articles where `isPillar == true`, ordered by `publishedAt desc`.

### 1.3 — Create pillar page 1: "Buying Property in Portugal"

- [x] Create a new journal article in Sanity (or demo data if Sanity is not yet live) with:
  - **Slug:** `buying-property-in-portugal-guide`
  - **Category:** `buyer-guides`
  - **isPillar:** `true`
  - **Title (EN):** "Buying Property in Portugal: A Practical Guide for International Buyers"
  - **Title (PT):** "Comprar Imóveis em Portugal: Um Guia Prático para Compradores Internacionais"
  - **Length target:** 1,800–2,400 words EN; translated 1:1 PT.
  - **Required sections (H2s):**
    1. Who can buy property in Portugal
    2. The purchase process, step by step
    3. Costs at purchase (IMT, stamp duty, notary, legal)
    4. Ongoing costs (IMI, condominium fees)
    5. Financing as a non-resident
    6. Typical timeline from offer to keys
    7. Common mistakes and how Viriato helps
  - **Internal links (minimum):** link to `/{lang}/locations/lisbon`, `/{lang}/locations/algarve`, `/{lang}/locations/comporta`, `/{lang}/methodology`, and `/{lang}/contact`.
- [x] Confirm the article renders with the existing journal article template.

### 1.4 — Create pillar page 2: "Portugal Tax Incentives Explained"

- [x] Same as 1.3 with:
  - **Slug:** `portugal-tax-incentives-property-buyers`
  - **Title (EN):** "Portugal Tax Incentives for Property Buyers: NHR, IFICI, and the New Regimes"
  - **Title (PT):** "Incentivos Fiscais em Portugal para Compradores: NHR, IFICI e os Novos Regimes"
  - **Required sections (H2s):**
    1. The status of the NHR regime today
    2. IFICI (the scientific/research replacement) — what it actually covers
    3. Digital Nomad Visa / D7 residency and property
    4. Tax implications of rental income
    5. Where this sits in a buying decision
  - **Disclaimer block:** Must include a clearly-labelled "This is editorial context, not tax advice" paragraph. Copy to be written with legal counsel review.

### 1.5 — Create pillar page 3: "Where to Buy in Portugal"

- [x] Same as 1.3 with:
  - **Slug:** `where-to-buy-property-portugal`
  - **Title (EN):** "Where to Buy in Portugal: A Location Intelligence Overview"
  - **Title (PT):** "Onde Comprar em Portugal: Uma Visão Editorial das Localizações"
  - **Structure:** One named section per macro-location (Lisbon, Porto, Cascais, Algarve, Comporta, Gaia, Silver Coast, Madeira). Each section: ~200 words + one linked development + link to full location page.

### 1.6 — Surface pillar content on development detail pages

- [x] In `app/[lang]/(main)/developments/[slug]/page.tsx`, after the `InquiryPanel` block, add a "Before you enquire" module that links to the three pillar guides. Use the existing em-dash list pattern (see `docs/design-language.md` § 7 "List pattern").
- [x] Fetch pillar articles via the new `getPillarArticles()` query. Render only if at least one pillar article exists.

### 1.7 — Surface pillar content on journal index

- [x] In `app/[lang]/(main)/journal/page.tsx`, add a "Guides" section at the top of the article grid (above the category nav strip) that renders up to 3 pillar articles in the default `ArticleCard` grid.

### 1.8 — Acceptance criteria

- [x] All three pillar pages return 200 in both locales.
- [x] Sitemap includes all six URLs (3 articles × 2 locales).
- [x] Each pillar article has at least 5 outbound internal links to locations/developments.
- [x] Each pillar page passes Core Web Vitals (LCP < 2.5s on 4G throttled test).
- [x] `Article` JSON-LD renders on each pillar page (see Gap 3 task 3.5 for the schema component).

---

## Gap 2 — Location Granularity (Sub-Locations)

**Goal:** Add a parent/child hierarchy to locations so neighbourhoods and sub-regions (Príncipe Real, Foz do Douro, Golden Triangle) have their own pages without duplicating the location template.

### 2.1 — Extend the `location` Sanity schema

- [x] In `sanity/schemas/location.ts`, add before `nearbyLocations`:
  ```ts
  defineField({
    name: 'parentLocation',
    title: 'Parent Location',
    type: 'reference',
    to: [{ type: 'location' }],
    description: 'Leave empty for macro-locations (e.g. Lisbon). Set for neighbourhoods (e.g. Príncipe Real → Lisbon).',
  }),
  defineField({
    name: 'locationType',
    title: 'Location Type',
    type: 'string',
    options: { list: ['macro', 'neighbourhood', 'sub-region'], layout: 'radio' },
    initialValue: 'macro',
    validation: r => r.required(),
  }),
  ```

### 2.2 — Update queries and demo data

- [x] In `lib/queries.ts`:
  - Update `getAllLocations()` to include `parentLocation->{name, slug}` and `locationType` in the projection.
  - Add `getLocationChildren(parentSlug, lang)` returning all locations where `parentLocation->slug.current == $parentSlug`.
  - Add `getLocationBreadcrumbs(slug, lang)` that walks the parent chain up to the macro location.
- [x] Update `lib/demo-data.ts`:
  - Add `locationType: 'macro'` to all existing demo locations.
  - Add 5 neighbourhood demo locations with `parentLocation` set:
    - Príncipe Real → Lisbon
    - Chiado → Lisbon
    - Foz do Douro → Porto
    - Golden Triangle → Algarve
    - Vale do Lobo → Golden Triangle (nested — demonstrates 3-level hierarchy)

### 2.3 — Update the location page template

- [x] In `app/[lang]/(main)/locations/[slug]/page.tsx`:
  - Fetch child locations via `getLocationChildren(slug, lang)`.
  - If `loc.locationType === 'macro'` and children exist, render a "Neighbourhoods" section before "Developments in this location". Use the location tile grid pattern (`repeat(auto-fill, minmax(240px, 1fr))`, 1px border grid).
  - If `loc.parentLocation` exists, include the parent in the breadcrumb: `Home › Locations › {parent.name} › {loc.name}`.
  - Add `BreadcrumbList` JSON-LD that reflects the full parent chain.

### 2.4 — Add two new macro-locations

- [x] Create Silver Coast location (covers Óbidos, Peniche, Ericeira, Nazaré region). Intro copy to be supplied by editorial.
- [x] Create Madeira location. Intro copy to be supplied by editorial.
- [x] Both must be added to demo data with `locationType: 'macro'` and appropriate `region` field value.
- [x] Update `location` schema region enum if Ericeira/Óbidos need finer regional grouping.

### 2.5 — Add priority neighbourhood pages

Required neighbourhoods to publish (content written by editorial):

| Neighbourhood | Parent | Rationale |
|---|---|---|
| Príncipe Real | Lisbon | Named in Encosta do Bairro editorial thesis |
| Chiado | Lisbon | High-intent Lisbon buyer query |
| Parque das Nações | Lisbon | Modern-apartment buyer segment |
| Foz do Douro | Porto | Article exists; no entity page |
| Golden Triangle | Algarve | Investment article exists; no entity page |

- [x] Each page needs: 150–250 word editorial intro, lat/long coordinates, at least one linked journal article, `parentLocation` set.

### 2.6 — Link articles to sub-locations retroactively

- [x] Update the `Why Comporta Remains Portugal's Most Protected Coastline` article to link to the Comporta page (already does).
- [x] Update the `Porto's Foz District` article to set `linkedLocation` to the new Foz do Douro neighbourhood entity.
- [x] Update `Golden Triangle Investment Landscape` article to `linkedLocation: Golden Triangle` instead of `Algarve`.

### 2.7 — Acceptance criteria

- [x] Neighbourhood pages render with full parent breadcrumb.
- [x] Macro-location pages show a "Neighbourhoods" grid when children exist.
- [x] Sitemap includes all new locations in both locales with priority 0.8.
- [x] `BreadcrumbList` schema reflects actual parent hierarchy.
- [x] Parent-child links are bidirectional (parent shows child grid; child shows parent in breadcrumb + "back to {parent}" link).

---

## Gap 3 — Journal Category System Repair

**Goal:** Disable the empty `new-developments` category, add stronger structured data to article pages, and establish category-level editorial intros.

### 3.1 — Replace `new-developments` with `market-intelligence`

- [x] In `sanity/schemas/journalArticle.ts`, replace `{ title: 'New Developments', value: 'new-developments' }` with `{ title: 'Market Intelligence', value: 'market-intelligence' }`.
- [x] In `lib/i18n/en.json`, rename the corresponding category key.
- [x] In `lib/i18n/pt.json`, set the PT translation to `'Informação de Mercado'`.
- [x] In `app/sitemap.ts`, replace `'new-developments'` with `'market-intelligence'`.
- [x] Add a 301 redirect from `/journal/category/new-developments` → `/journal/category/market-intelligence` in `next.config.ts` for both locales.

### 3.2 — Make sitemap categories CMS-driven

- [x] In `app/sitemap.ts`, replace the hard-coded `ARTICLE_CATEGORIES` array with a query: categories that have at least 1 published article in that locale.
- [x] Add `getCategoriesWithArticles(lang)` to `lib/queries.ts`:
  ```groq
  *[_type == "journalArticle" && !(_id in path("drafts.**")) && noindex != true] {
    category
  } | order(category asc)
  ```
  Then dedupe in TS.
- [x] Ensure the sitemap still emits category URLs for *both* EN and PT even if only one locale has content — because page renders bilingually.

### 3.3 — Add editorial intros to category pages

- [x] Create a new Sanity schema `sanity/schemas/journalCategory.ts`:
  ```ts
  export const journalCategory = defineType({
    name: 'journalCategory',
    title: 'Journal Category',
    type: 'document',
    fields: [
      defineField({ name: 'slug', type: 'string', validation: r => r.required() }), // matches category value enum
      defineField({ name: 'title', type: 'object', fields: [
        { name: 'en', type: 'string' }, { name: 'pt', type: 'string' },
      ]}),
      defineField({ name: 'intro', type: 'object', fields: [
        { name: 'en', type: 'text', rows: 3 }, { name: 'pt', type: 'text', rows: 3 },
      ]}),
      defineField({ name: 'seoTitle', type: 'string' }),
      defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
    ],
  })
  ```
- [x] Register the new schema in `sanity/schemas/index.ts`.
- [x] In `app/[lang]/(main)/journal/category/[category]/page.tsx`, fetch the matching `journalCategory` document and render its editorial intro (50–150 words) above the article grid.
- [x] Use the category document's `seoTitle` / `seoDescription` in `generateMetadata` when present.

### 3.4 — Seed category intros (editorial content task)

- [x] Write a 100-word intro for each of the 6 active categories (architecture, area-guides, branded-residences, market-intelligence, second-home, investment, buyer-guides).
- [x] Translate each to PT.
- [x] Create the 7 `journalCategory` documents in Sanity (or demo data).

### 3.5 — Add `Article` JSON-LD to journal article page

- [x] In `app/[lang]/(main)/journal/article/[slug]/page.tsx`, add an `Article` schema block alongside the existing hero render:
  ```ts
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: ogImage,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt ?? article.publishedAt,
    author: { '@type': 'Organization', name: 'Portugal Developments Review' },
    publisher: {
      '@type': 'Organization',
      name: 'Portugal Developments Review by Viriato',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: `${BASE_URL}/${lang}/journal/article/${slug}`,
    ...(article.isPillar && { articleSection: 'Pillar Guide' }),
  }
  ```
- [x] Add `BreadcrumbList` schema: Home → Journal → Category → Article.
- [x] Render both via the existing `<JsonLd data={...} />` component.

### 3.6 — Acceptance criteria

- [x] `/journal/category/new-developments` (both locales) returns 301 to `/market-intelligence`.
- [x] Sitemap only emits categories that have at least one article.
- [x] Every category page has an editorial intro.
- [x] Every article page renders `Article` + `BreadcrumbList` JSON-LD; Rich Results Test passes.

---

## Gap 4 — Lifestyle Tag Landing Pages

**Goal:** Convert the 9 lifestyle tags from card metadata into indexable, editorialised landing pages that aggregate matching developments.

### 4.1 — Define canonical tag slugs

- [x] Add a tag slug map to `lib/i18n/index.ts` (or create `lib/lifestyle-tags.ts`):
  ```ts
  export const LIFESTYLE_TAG_SLUGS: Record<string, string> = {
    'Golf': 'golf',
    'Beachfront': 'beachfront',
    'Marina': 'marina',
    'City Centre': 'city-centre',
    'Countryside': 'countryside',
    'Mountain': 'mountain',
    'Historic Quarter': 'historic-quarter',
    'Spa & Wellness': 'spa-wellness',
    'Investment-grade': 'investment-grade',
  }
  export const LIFESTYLE_TAG_FROM_SLUG = Object.fromEntries(
    Object.entries(LIFESTYLE_TAG_SLUGS).map(([k, v]) => [v, k])
  )
  ```

### 4.2 — Create the lifestyle route

- [x] Create `app/[lang]/(main)/lifestyle/[tag]/page.tsx`:
  - `generateStaticParams`: return only tags that appear in at least one published, non-noindexed development.
  - `generateMetadata`: localized title per locale. Example: *"Golf Property in Portugal"* / *"Imóveis de Golfe em Portugal"*.
  - Page body:
    1. Hero with eyebrow (lifestyle tag), H1, and 150-word editorial intro (from the new schema in 4.3).
    2. Development grid (existing `DevelopmentCard`) filtered by tag.
    3. Related journal articles section (optional; renders if tagged articles exist).
    4. Related lifestyles strip (other tags).
  - Must match the layout conventions in `docs/design-language.md` §4 (section padding 64px, single `H1`, `border-bottom` separators).

### 4.3 — Add lifestyle content schema

- [x] Create `sanity/schemas/lifestyle.ts`:
  ```ts
  export const lifestyle = defineType({
    name: 'lifestyle',
    title: 'Lifestyle',
    type: 'document',
    fields: [
      defineField({ name: 'tag', type: 'string', options: { list: [
        'Golf','Beachfront','Marina','City Centre','Countryside','Mountain',
        'Historic Quarter','Spa & Wellness','Investment-grade',
      ]}, validation: r => r.required() }),
      defineField({ name: 'slug', type: 'slug', options: { source: 'tag' }, validation: r => r.required() }),
      defineField({ name: 'intro', type: 'object', fields: [
        { name: 'en', type: 'text', rows: 4 }, { name: 'pt', type: 'text', rows: 4 },
      ]}),
      defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'seoTitle', type: 'string' }),
      defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
      defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
    ],
  })
  ```
- [x] Register in `sanity/schemas/index.ts`.
- [x] Seed demo lifestyle documents for the 3 tags with multiple developments: Golf, Beachfront, Investment-grade.

### 4.4 — Extend queries

- [x] `lib/queries.ts`:
  - `getDevelopmentsByLifestyle(tag, lang)` — returns developments where `$tag in lifestyleTags`, excluding noindexed.
  - `getLifestyle(slug, lang)` — returns the `lifestyle` document.
  - `getActiveLifestyleTags()` — returns the distinct tags present in at least one published development (used by `generateStaticParams`).

### 4.5 — Add structured data

- [x] On each lifestyle page, render `ItemList` JSON-LD listing the developments shown, plus `BreadcrumbList` (Home → Lifestyle → Tag).

### 4.6 — Surface lifestyle links

- [x] On `DevelopmentCard`, make each rendered `lifestyleTag` a link to `/{lang}/lifestyle/{slug}` (currently renders as plain text).
- [x] Add "Lifestyle" column to the footer nav linking to the top 4 lifestyle pages.

### 4.7 — Add to sitemap

- [x] In `app/sitemap.ts`, add a `lifestylePages` section:
  ```ts
  const lifestyleTags = await getActiveLifestyleTags()
  const lifestylePages = LOCALES.flatMap(locale =>
    lifestyleTags.map(tag => ({
      url: `${BASE}/${locale}/lifestyle/${LIFESTYLE_TAG_SLUGS[tag]}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )
  ```

### 4.8 — Acceptance criteria

- [x] `/lifestyle/golf`, `/lifestyle/beachfront`, `/lifestyle/investment-grade` all return 200 in both locales.
- [x] Tags with zero matching developments return 404 (not an empty page).
- [x] Tag links on `DevelopmentCard` navigate to the correct lifestyle page.
- [x] Sitemap emits only active lifestyle tags.
- [x] `ItemList` JSON-LD passes Rich Results Test.

---

## Gap 5 — Developer Identity Pages

**Goal:** Create `/developers` hub and `/developers/{slug}` pages for the developers behind curated projects.

### 5.1 — Extend the `developer` schema

- [x] In `sanity/schemas/developer.ts`, add:
  ```ts
  defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
  defineField({ name: 'bio', title: 'Editorial Bio', type: 'object', fields: [
    defineField({ name: 'en', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'pt', type: 'array', of: [{ type: 'block' }] }),
  ]}),
  defineField({ name: 'shortDescription', type: 'object', description: 'One-line summary for listings.', fields: [
    defineField({ name: 'en', type: 'string' }),
    defineField({ name: 'pt', type: 'string' }),
  ]}),
  defineField({ name: 'foundedYear', type: 'number' }),
  defineField({ name: 'headquartersCity', type: 'string' }),
  defineField({ name: 'seoTitle', type: 'string' }),
  defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  defineField({ name: 'seoImage', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ```

### 5.2 — Update demo data

- [x] In `lib/demo-data.ts`, restructure developers as top-level entities (they're currently inlined on developments). Each developer gets: `_id`, `name`, `slug`, `website`, `isViriatoClient`, `shortDescription`, `bio` (short placeholder), `foundedYear`, `headquartersCity`.
- [x] Update developments to reference developers by `_ref` pattern consistent with how Sanity references will resolve.

### 5.3 — Build the developer hub page

- [x] Create `app/[lang]/(main)/developers/page.tsx`:
  - H1: "Developers" / "Promotores"
  - 150-word editorial intro about how PDR selects developers (reference `/methodology`).
  - Grid of developer cards (reuse layout conventions from location tile grid: `repeat(auto-fill, minmax(240px, 1fr))` with border grid pattern). Each card shows name, city, short description, number of developments.
  - Filter option: "Viriato Clients" vs "All Developers" (client-state filter, no URL params — matches existing `DevelopmentsIndex` pattern).

### 5.4 — Build the developer detail page

- [x] Create `app/[lang]/(main)/developers/[slug]/page.tsx`:
  - Breadcrumb: Home → Developers → {name}
  - Hero: eyebrow ("Developer"), H1 = developer name, `shortDescription` below.
  - Key facts block: Founded, HQ, Website (external link, `rel="nofollow noopener"`).
  - Editorial bio rendered via `PortableTextRenderer`.
  - "Developments by {name}" — grid of their developments using `DevelopmentCard`.
  - Sticky sidebar (reuse detail page `1fr 360px` grid): inquiry/contact CTA, "Is this your company? Get in touch" link.
- [x] Add `generateStaticParams` that returns all developer slugs.
- [x] Add `generateMetadata` with localised title: `"{name} — Developer Profile | Portugal Developments Review"`.

### 5.5 — Create a `DeveloperCard` component

- [x] Create `components/DeveloperCard.tsx` following the DevelopmentCard inline-style pattern. Two variants: `default` (grid card) and `compact` (list item). No hover effects. No icons.

### 5.6 — Link developers from development detail pages

- [x] In `app/[lang]/(main)/developments/[slug]/page.tsx`, update the developer credit block to link `dev.developer.name` to `/{lang}/developers/{dev.developer.slug.current}` (internal link with `borderBottom` style) instead of/alongside the external website link.

### 5.7 — Queries

- [x] In `lib/queries.ts`:
  - `getAllDevelopers(lang)`
  - `getDeveloperBySlug(slug, lang)`
  - `getDevelopmentsByDeveloper(developerSlug, lang)`

### 5.8 — Structured data

- [x] On the developer detail page, render `Organization` JSON-LD:
  ```ts
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dev.name,
    url: `${BASE_URL}/${lang}/developers/${slug}`,
    ...(dev.website && { sameAs: [dev.website] }),
    ...(dev.logo && { logo: urlFor(dev.logo).width(400).url() }),
    ...(dev.foundedYear && { foundingDate: String(dev.foundedYear) }),
    ...(dev.headquartersCity && { address: { '@type': 'PostalAddress', addressLocality: dev.headquartersCity, addressCountry: 'PT' } }),
  }
  ```
- [x] Add `BreadcrumbList`.

### 5.9 — Footer + sitemap

- [x] Add "Developers" link to site footer under "Platform".
- [x] Add "Developers" link to `Header.tsx` navigation between Locations and Journal.
- [x] In `app/sitemap.ts`, add a `developerPages` section producing both locales.

### 5.10 — Acceptance criteria

- [x] `/developers` index page returns 200 in both locales.
- [x] Each existing demo developer has a live profile page.
- [x] Development detail pages link to the developer page (not only the external website).
- [x] `Organization` + `BreadcrumbList` JSON-LD render and pass Rich Results Test.
- [x] Header and Footer include Developers link.

---

## Gap 6 — Comparative / Decision-Support Content

**Goal:** Publish three comparison-format articles that capture mid-funnel decision queries and interlink to multiple locations.

### 6.1 — Confirm article format fits existing schema

- [x] No schema change required — these are standard `journalArticle` documents with category `investment` or `second-home`.
- [x] Add a `compareLocations` optional field to `journalArticle` schema for future filter surfaces:
  ```ts
  defineField({
    name: 'compareLocations',
    title: 'Compared Locations',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'location' }] }],
    description: 'For comparison articles. Used to surface this article on each compared location page.',
  }),
  ```

### 6.2 — Commission article 1: Lisbon vs Algarve

- [x] Brief:
  - **Slug:** `lisbon-or-algarve-property-guide`
  - **Category:** `second-home`
  - **Title (EN):** "Lisbon or the Algarve: Two Different Arguments for Portugal Property"
  - **Length:** 1,400–1,800 words
  - **H2 structure:** Climate and seasons; Capital appreciation trends; Rental yield profile; Infrastructure and access; Lifestyle and community; PDR's view.
  - **Compare locations:** Lisbon + Algarve (both linked).
  - **Required internal links:** both location pages, at least one development per location, the "Buying Property in Portugal" pillar (Gap 1).

### 6.3 — Commission article 2: Off-plan vs Ready-to-Move

- [x] Brief:
  - **Slug:** `off-plan-vs-ready-portugal-property`
  - **Category:** `investment`
  - **Title (EN):** "Off-Plan vs Ready-to-Move: What the Portuguese Market Currently Offers"
  - **Length:** 1,200–1,500 words
  - **Required internal links:** at least 2 off-plan developments + 2 completed/selling-now developments.
  - **Cross-link from:** the `/developments` index page — add a small "Weighing off-plan vs ready?" link in the filter bar area (matching the muted link style).

### 6.4 — Commission article 3: Comporta — Investment vs Lifestyle

- [x] Brief:
  - **Slug:** `comporta-investment-versus-lifestyle`
  - **Category:** `investment`
  - **Title (EN):** "Comporta: The Investment Case vs the Lifestyle Case"
  - **Length:** 1,400–1,700 words
  - **Compare locations:** Comporta + (Cascais or Algarve as reference points).
  - **Required:** link to Quinta da Comporta development.

### 6.5 — Surface comparison articles on compared location pages

- [x] Update `app/[lang]/(main)/locations/[slug]/page.tsx` to fetch articles where either `linkedLocation` or `compareLocations` includes this location.
- [x] Render comparison articles in the existing "Stories from {location}" journal section with a subtle label prefix (e.g. `Comparison —`).

### 6.6 — Acceptance criteria

- [x] All three articles published in EN and PT.
- [x] Each has minimum 5 outbound internal links.
- [x] Each is linked from every location it references.
- [x] Articles render `Article` JSON-LD (from Gap 3 task 3.5).

---

## Gap 7 — Market Signals / Data-Led Content

**Goal:** Establish PDR as a source of market intelligence through one prose-led market note per year, in a form compatible with the restrained visual system.

### 7.1 — Introduce `market-intelligence` as an active category

- [x] Already covered in Gap 3.1 (rename of `new-developments`).
- [x] Seed the `journalCategory` document for `market-intelligence` with an intro like: *"Periodic editorial notes on the Portuguese new-development market — pricing context, pipeline observations, and PDR's forward view."*

### 7.2 — Define the market note format

The market note must comply with `docs/design-language.md` §13 ("Don't introduce... data visualisation widgets... without explicit discussion"). Use prose + em-dash lists instead of tables and charts.

- [x] Structure (required H2s):
  1. Market context (one paragraph)
  2. Key observations (3–5 em-dash list items, each ~50 words)
  3. Notable pipeline (3–5 named developments, each linked)
  4. Where PDR sees value
  5. PDR's forward view (closing paragraph)

### 7.3 — Publish the inaugural market note

- [x] Brief:
  - **Slug:** `portugal-new-developments-market-note-h1-{year}`
  - **Category:** `market-intelligence`
  - **Title (EN):** "Portugal New Developments — Market Note, H1 {year}"
  - **Length:** 1,500–2,000 words
  - **isPillar:** `false` (not evergreen — it's periodic).
  - **publishedAt:** date of publication.
- [x] Editorial responsibility: Viriato team produces the underlying analysis; PDR edits to voice.

### 7.4 — Add a "Market Intelligence" surface to the journal index

- [x] In `app/[lang]/(main)/journal/page.tsx`, add a dedicated "Market Intelligence" row above the general article grid if at least one market-intelligence article exists. Show the 2 most recent notes in a compact list (no images — match the design doc's restraint guidance for this surface).

### 7.5 — Cross-link from the homepage

- [x] In `app/[lang]/(main)/page.tsx`, within the existing Journal section, if the latest article is a market-intelligence piece, surface it with a small "Market note" eyebrow label above the card.

### 7.6 — Consider a dedicated landing for the note (optional, phase 2)

- [x] Evaluate whether future market notes justify a `/market-intelligence` hub separate from the journal category page. Skip in v1 — the category page is sufficient.

### 7.7 — Acceptance criteria

- [x] Market note published and live in both locales.
- [x] Market note appears on `/journal`, `/journal/category/market-intelligence`, and homepage journal row.
- [x] At least 3 developments and 2 locations are linked from within the note's body.
- [x] `Article` JSON-LD renders with `articleSection: 'Market Intelligence'`.

---

## Cross-Cutting Infrastructure Tasks

These are required for any of the above to work correctly. Complete these **before** any of the content-heavy tasks.

### CC.1 — Fix canonical to be self-referencing

- [x] In `lib/i18n/metadata.ts`, update `getAlternates(path, locale)` to accept the current locale and set `canonical: ${BASE}/${locale}${path}`.
- [x] Update all callers across `app/**/page.tsx` to pass `lang` as the second argument.
- [x] Verify PT pages now declare their own canonical (not EN).

### CC.2 — Add `metadataBase` to root layout

- [x] In `app/[lang]/layout.tsx`, add `metadataBase: new URL(BASE_URL)` so all OG image URLs resolve absolutely.

### CC.3 — Pagination on `/journal`

- [x] Before publishing more than ~30 articles, add `?page=N` pagination to the journal index with self-canonical for each page.
- [x] `rel="next" / rel="prev"` via crawlable pagination links (not meta tags — deprecated).

### CC.4 — PDF brochure indexation

- [x] Proxy PDF brochures through `app/api/brochure/[id]/route.ts` and set `X-Robots-Tag: noindex, nofollow` on the response so Google doesn't index raw PDFs separately from the development page.

### CC.5 — Dictionary SEO keys

- [x] Add a `seo` namespace to `lib/i18n/en.json` and `pt.json` containing per-page title/description strings. Replace hard-coded English `metadata` exports across the codebase with `generateMetadata` functions that read from the dictionary.

---

## Ordering and Effort Estimate

| # | Task | Effort | Priority |
|---|---|---|---|
| CC.1–CC.2 | Canonical + metadataBase fixes | 0.5d | Blocker — do first |
| CC.5 | Dictionary SEO keys | 1d | High |
| Gap 1 | 3 pillar pages (structure + schema only) | 2d dev + 5d editorial | Highest ROI |
| Gap 3 | Category repair + Article schema | 2d | High |
| Gap 2 | Sub-location hierarchy | 3d dev + content per location | High |
| Gap 4 | Lifestyle landing pages | 3d | Medium — depends on content volume |
| Gap 5 | Developer pages | 3d | Medium |
| Gap 6 | Comparison articles | editorial-only | Medium |
| Gap 7 | Market note | editorial-only | Medium — needs Viriato data input |
| CC.3 | Journal pagination | 1d | Low — only at scale |
| CC.4 | PDF noindex proxy | 0.5d | Low |

---

## Definition of Done (applies to every task)

- [x] Renders in EN and PT without layout regression.
- [x] Passes Core Web Vitals on a mid-tier mobile device (LCP < 2.5s, CLS < 0.1, INP < 200ms).
- [x] `hreflang` tags present and self-referencing per locale.
- [x] Structured data validates in Google Rich Results Test.
- [x] No new colors, shadows, gradients, or animations introduced.
- [x] All new pages added to `app/sitemap.ts`.
- [x] All new internal links use relative paths and `next/link`.
- [x] At least one H1, logical H2→H3 hierarchy, no heading skips.
- [x] Images have descriptive `alt` text; decorative images use `alt=""`.
- [x] New Sanity fields include a `description` aimed at editorial users.
- [x] Demo data updated so the page renders without Sanity being connected.
