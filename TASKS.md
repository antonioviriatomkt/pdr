# Portugal Developments Review — Tasks

## Primary Tasks

### Project Setup
- [x] Initialize Next.js with TypeScript
- [x] Configure linting and formatting
- [x] Set up Tailwind CSS
- [x] Set up environment variables (.env.local)

### CMS Setup
- [x] Configure Sanity (schemas defined in /sanity/)
- [x] Add all required schemas (Development, Location, JournalArticle, Developer, SiteSettings)
- [x] Add demo content for developments, locations, journal articles, developers (/lib/demo-data.ts)
- [ ] Connect Sanity Project ID to enable live CMS (requires Sanity account setup)

### Core Layout System
- [x] Global layout (app/layout.tsx)
- [x] Header (components/Header.tsx)
- [x] Footer (components/Footer.tsx)
- [x] Navigation (in Header — desktop + mobile)
- [x] Typography system (globals.css — Georgia serif + sans-serif)
- [x] Color tokens (CSS custom properties: --background, --foreground, --muted, --border, --surface)
- [x] Spacing system (container-editorial class, generous padding)

### Homepage
- [x] Build homepage sections (hero, location nav, featured developments, browse by location, editorial spotlight, methodology teaser, journal section, developer invitation)
- [x] Connect homepage content from demo data
- [x] Make all CTA links functional

### Developments Index
- [x] Build listing page (/developments)
- [x] Add filters (location, type, status)
- [x] Add sorting (featured, newest)
- [x] Connect demo data

### Development Detail Page
- [x] Build editorial detail template (/developments/[slug])
- [x] Add key facts, CTA block (InquiryPanel), related content, and area context
- [x] Connect demo data

### Location Pages
- [x] Build location template (/locations/[slug])
- [x] Add intro, featured developments, related articles, and nearby locations
- [x] Connect demo data

### Journal
- [x] Build journal index (/journal)
- [x] Build journal category page (/journal/category/[category])
- [x] Build journal article page (/journal/article/[slug])
- [x] Connect related content links (linked locations + developments in sidebar)

### Static Brand Pages
- [x] Methodology page (/methodology)
- [x] About page (/about)
- [x] For Developers page (/for-developers)
- [x] Contact page (/contact)

### Lead Capture
- [x] Build working inquiry forms (InquiryPanel + ContactForm)
- [x] Validate submissions (server-side validation in API route)
- [x] Send submissions (logs to console; emails via Resend when API key configured)
- [x] Add success and error states

### SEO
- [x] Metadata per page (dynamic metadata in each page)
- [x] Open Graph tags (in root layout metadata)
- [x] Sitemap (/app/sitemap.ts — generates /sitemap.xml)
- [x] robots.txt (/app/robots.ts)
- [x] Structured internal linking (developments ↔ locations ↔ journal throughout)

### QA and Polish
- [x] Responsive checks (mobile nav, responsive grids)
- [ ] Accessibility checks
- [x] Empty states (developments index + location pages)
- [x] Error states (form error states)
- [x] Content cleanup (no placeholder junk — all demo content is realistic)

---

## Secondary Tasks

- [ ] Seed more realistic demo content
- [ ] Improve filter UX
- [ ] Add richer developer pages later if needed
- [ ] Add search improvements later if needed
- [ ] Add CMS previews if easy
- [ ] Add image optimization improvements (real images from Sanity)
- [ ] Add analytics
- [ ] Add better form routing / CRM integration later
- [x] Add multilingual support (EN + PT, sub-path routing, UI strings + CMS content)
  - [x] 1. Configure Next.js i18n routing (`/en/` and `/pt/` sub-paths, default locale)
  - [x] 2. Create translation files (`lib/i18n/en.json` + `pt.json`) and translation utility
  - [x] 3. Add language switcher to Header
  - [x] 4. Update all UI components to use translation keys (replace hardcoded strings)
  - [x] 5. Update Sanity schemas for localized CMS content (Development, Location, JournalArticle)
  - [x] 6. Update CMS data fetching to pass and respect locale
  - [x] 7. Update SEO metadata for locales (hreflang tags, per-locale titles/descriptions)
- [ ] Refine design details without changing the restrained visual system
- [x] Connect Sanity CMS (requires sanity.io project creation)

---

## Notes
- Run locally: `npm run dev` → http://localhost:3000
- Build: `npm run build`
- Forms: without RESEND_API_KEY, submissions are logged to console. Add key to .env.local to enable email.
- CMS: Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local after creating a Sanity project. Currently runs entirely on demo data.

---

## Status snapshot (audited 2026-05-03)

Cross-references the granular task lists:

- **Mobile UI** — `tasks-mobile-ui.md` — ✅ all 8 layout fixes shipped.
- **Content SEO (gaps 1–7)** — `TASKS_Content.md` — ✅ all checked.
- **Technical SEO** — `TASKS_technical_seo.md` — 20 of 25 done. Remaining work:
  - ❌ SEO-24 — PDF brochure proxy with `X-Robots-Tag: noindex`
  - ❌ SEO-25 — journal pagination
  - ⚠️ SEO-17 — "More stories" link from location pages to journal category
  - ⚠️ SEO-19 — `loading="lazy"` + toggle gate on brochure iframe
  - ⚠️ SEO-22 — extract co-located `<style>` blocks to `globals.css`
  - ⚠️ SEO-23 — make sitemap categories live (currently build-time)
- **Editorial content** — SEO-C1 to C4 — content writing, not code.

Genuine remaining engineering work is narrow: 3 not-done items + 4 partials. Everything else is shipped.
