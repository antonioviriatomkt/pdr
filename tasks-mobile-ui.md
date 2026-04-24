# Mobile UI Responsiveness — Diagnosis & Task List

Screenshots source: `docs/mobile responsiveness debug screenshots /`

## Root cause (shared across all pages)

Nearly every editorial page uses **inline `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', ... }}`** (or `'1fr 360px'`) with no accompanying mobile breakpoint. Inline `style` cannot express media queries, so these two-column layouts never collapse on narrow viewports — producing the cramped, truncated, overlapping content visible in every screenshot.

The homepage hero already uses the correct pattern (className + injected `<style>` tag with `@media (max-width: 768px)` rules — see [app/[lang]/(main)/page.tsx:75](app/[lang]/(main)/page.tsx:75)). That same pattern needs to be applied to the other sections.

---

## Per-screenshot diagnosis

### 1. `about.png` — About page
- Two columns ("What this platform is" / "What developers receive") rendered side-by-side on mobile at `1fr 1fr`.
- Body copy reduced to ~15 char lines; the right column's cards are cramped.
- **Source:** [app/[lang]/(main)/about/page.tsx:44](app/%5Blang%5D/(main)/about/page.tsx:44)

### 2. `contact page.png` — Contact page
- Form on left, "What happens next" sidebar on right, forced to `1fr 1fr`.
- Input fields show placeholder truncated: `Your full nar`, `your@email`, `+351 or inte`, "General Qu…", "Name of the…".
- "SEND ENQUIRY" CTA is a tiny square. Vertical divider (`borderLeft`) still present, wasting horizontal space.
- **Source:** [app/[lang]/(main)/contact/page.tsx:44](app/%5Blang%5D/(main)/contact/page.tsx:44) (and `paddingLeft: 80px` on the sidebar at line 49)

### 3. `development page 1.png` & `development page 2.png` — Development detail page
- Main grid is `gridTemplateColumns: '1fr 360px'`. On a ~390px viewport, that is mathematically impossible, which is why the inquiry panel visually overlaps / sits beside the article text instead of stacking.
- The inquiry aside has `position: sticky, top: 80px`; on mobile this would float over the article while scrolling. It must become `position: static` (stacked below) on mobile.
- Inquiry CTAs ("Request info", "Register interest", "Download brochure", "Schedule viewing", "Speak to advisor") are truncated to `Requ…`, `Regi…`, `Down…`, `Sche…`, `Spea…`.
- Screenshot 2 shows the 560px-tall brochure iframe bleeding behind the sticky aside — brochure text "SERRALVES BOAVISTA" is cut to "SERRAL BOAVI".
- **Source:** [app/[lang]/(main)/developments/[slug]/page.tsx:182](app/%5Blang%5D/(main)/developments/%5Bslug%5D/page.tsx:182) (grid) and line 317 (sticky aside) and line 234 (iframe `height: 560px`)

### 4. `developments page filters.png` — Developments index filters
- The sticky filter bar flex-wraps but the two selects ("All Locations", "All Types") land on a shared row that's fine, and "All Status" + Sort wraps to a messy second row. Sort's "Featured / Newest" buttons sit awkwardly at the right edge.
- Also: filter `select` elements are only as wide as content, so on mobile they look like small pills instead of full-width controls that are easier to tap.
- **Source:** [app/[lang]/(main)/developments/DevelopmentsIndex.tsx:68](app/%5Blang%5D/(main)/developments/DevelopmentsIndex.tsx:68) (filter bar flex row with `marginLeft: 'auto'` on the sort group)

### 5. `homepage loctions section.png` — Homepage "Locations" quick nav
- Row of city links (`Lisbon — Porto — Cascais — Algarve — Comporta — Gaia`) uses `display: flex; flex-wrap: wrap` with `marginLeft: 'auto'` on the `ALL DEVELOPMENTS →` link. On wrap, "ALL DEVELOPMENTS" jumps to an unpredictable position, dashes between cities wrap orphaned, and the row reads poorly.
- Also visible: the "Our Approach / Selection Criteria" two-column below is about to be rendered `1fr 1fr` on mobile (same class of bug as #1).
- **Source:** [app/[lang]/(main)/page.tsx:85](app/%5Blang%5D/(main)/page.tsx:85) (location quick nav) and [app/[lang]/(main)/page.tsx:184](app/%5Blang%5D/(main)/page.tsx:184) (approach grid)

### 6. `methodology.png` — Homepage "Our Approach" section (previewing methodology)
- This is actually the homepage, not `/methodology`. Two-column `1fr 1fr` with a `borderLeft` + `paddingLeft: 60px` divider. On mobile: left column gets ~20 chars wide, right column's "SELECTION CRITERIA" list items truncate mid-word ("Architectu", "Develope", "Fundame", "Specifica", "Authentic").
- The standalone `/methodology` route itself ([app/[lang]/(main)/methodology/page.tsx](app/%5Blang%5D/(main)/methodology/page.tsx)) is already a single column (`maxWidth: 680px`) and is fine — no change needed there.
- **Source:** [app/[lang]/(main)/page.tsx:184](app/%5Blang%5D/(main)/page.tsx:184) (approach grid with `borderLeft` divider at line 202)

### 7. `for-developers` page (not screenshotted but same bug)
- Two `gridTemplateColumns: '1fr 1fr'` grids at lines 59 and 91. Will exhibit identical cramping on mobile. Fix preemptively.
- **Source:** [app/[lang]/(main)/for-developers/page.tsx:59](app/%5Blang%5D/(main)/for-developers/page.tsx:59) and [app/[lang]/(main)/for-developers/page.tsx:91](app/%5Blang%5D/(main)/for-developers/page.tsx:91)

---

## Conventions for fixes

**The fix pattern:** inline `style={{}}` cannot hold media queries. Do one of these (pick whichever is least invasive per page):

1. Add a `className` to the grid wrapper, keep the two-column style inline for desktop, and append a co-located `<style>` block with the mobile override, exactly like [app/[lang]/(main)/page.tsx:73-79](app/%5Blang%5D/(main)/page.tsx:73):
   ```tsx
   <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', ... }}>…</div>
   <style>{`
     @media (max-width: 768px) {
       .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
     }
   `}</style>
   ```
2. OR promote the grid to a global CSS class in `app/globals.css` (preferred if the same shape repeats across pages — e.g. an `.editorial-two-col` utility).

**Breakpoint:** use `768px` (matches the existing hero/newsletter overrides). Don't introduce new breakpoints unless a specific layout demands it.

**When a section has a `borderLeft` + `paddingLeft` divider** (approach section, contact sidebar, newsletter form), the media query must also reset `border-left: none` and `padding-left: 0`, and usually add `border-top: 1px solid var(--border); padding-top: 28px` to preserve the visual divider stacked.

---

## Task list

### Task 1 — Fix About page two-column grid
**File:** [app/[lang]/(main)/about/page.tsx:44](app/%5Blang%5D/(main)/about/page.tsx:44)
- Add `className="about-grid"` to the wrapping `<div>` at line 44.
- Append a `<style>` tag at the end of the returned JSX with:
  `@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 0 !important; } }`
- Verify at 390px, 414px, 768px. Column should stack vertically, each section full-width.

### Task 2 — Fix Contact page form + sidebar layout
**File:** [app/[lang]/(main)/contact/page.tsx:44](app/%5Blang%5D/(main)/contact/page.tsx:44)
- Add `className="contact-grid"` to the grid wrapper at line 44 and `className="contact-aside"` to the sidebar `<div>` at line 49.
- Append a `<style>` tag:
  `@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 0 !important; } .contact-aside { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--border); padding-top: 32px !important; } }`
- Also open `components/ContactForm.tsx` and ensure each `<input>`/`<select>`/`<textarea>` is `width: 100%` so placeholders don't truncate. Add `max-width: 100%; box-sizing: border-box` where needed.
- Verify: inputs fill the row, placeholders read fully, SEND ENQUIRY button is full-width on mobile (add `className` on the button and force `width: 100%` via the same `<style>` block).

### Task 3 — Fix Development detail page main layout + sticky inquiry aside
**File:** [app/[lang]/(main)/developments/[slug]/page.tsx:182](app/%5Blang%5D/(main)/developments/%5Bslug%5D/page.tsx:182) and line 317
- Add `className="dev-grid"` at line 182 and `className="dev-aside"` at line 317.
- Append `<style>`:
  `@media (max-width: 900px) { .dev-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px 0 !important; } .dev-aside { position: static !important; top: auto !important; } }`
  (Use `900px` here, not `768px`, because `360px` sidebar + reasonable article gutters already falls apart below ~900px.)
- Verify: inquiry panel drops below article, no truncated CTA labels, no floating sticky overlap. Consider also making the inquiry panel CTA list `flex-wrap: wrap` or `flex-direction: column` inside `components/InquiryPanel.tsx` so long CTAs ("Schedule viewing", "Speak to advisor") are never truncated — inspect the panel and fix inline there if button truncation persists.

### Task 4 — Fix brochure iframe sizing on mobile
**File:** [app/[lang]/(main)/developments/[slug]/page.tsx:234](app/%5Blang%5D/(main)/developments/%5Bslug%5D/page.tsx:234)
- The iframe has `height: '560px'` which is both too tall and unscrollable on mobile. Add `className="brochure-iframe"` to the iframe and override via the same page-level `<style>` block:
  `@media (max-width: 768px) { .brochure-iframe { height: 420px !important; } }`
- Also ensure `width: 100%` is preserved (already is) and check `overflow: auto` on the parent if needed. After Task 3 fix, this iframe should no longer be overlapped by the aside.

### Task 5 — Fix Developments index filter bar
**File:** [app/[lang]/(main)/developments/DevelopmentsIndex.tsx:68](app/%5Blang%5D/(main)/developments/DevelopmentsIndex.tsx:68)
- Wrap filters into a layout that stacks vertically on mobile: give the outer row `className="filter-bar"` and each `<select>` a shared class `filter-select`. Give the sort group (`<div>` at line 88) a class `filter-sort`.
- Append `<style>`:
  ```
  @media (max-width: 768px) {
    .filter-bar { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .filter-select { width: 100% !important; }
    .filter-sort { margin-left: 0 !important; justify-content: flex-start !important; }
  }
  ```
- Verify: three filter dropdowns each full-width, sort row on its own below, tap targets ≥ 44px tall.

### Task 6 — Fix homepage Location quick nav row
**File:** [app/[lang]/(main)/page.tsx:85](app/%5Blang%5D/(main)/page.tsx:85)
- Give the flex wrapper `className="location-quicknav"` and the `ALL DEVELOPMENTS →` link `className="location-quicknav-all"`.
- Append to the existing `<style>` block at line 73:
  ```
  @media (max-width: 768px) {
    .location-quicknav { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
    .location-quicknav-all { margin-left: 0 !important; margin-top: 4px !important; }
  }
  ```
- On mobile, eyebrow label goes on top, city chips wrap on their own rows (consider hiding the em-dash separators on mobile by also targeting the inline separator spans — optional polish).

### Task 7 — Fix homepage "Our Approach" two-column section
**File:** [app/[lang]/(main)/page.tsx:184](app/%5Blang%5D/(main)/page.tsx:184) (and the aside with `borderLeft` at line 202)
- Add `className="approach-grid"` at line 184 and `className="approach-aside"` at line 202.
- Extend the existing homepage `<style>` block at line 73:
  ```
  @media (max-width: 768px) {
    .approach-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .approach-aside { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--border); padding-top: 28px !important; }
  }
  ```
- Verify the SELECTION CRITERIA bullets no longer truncate.

### Task 8 — Fix for-developers page (preemptive — same bug, not yet screenshotted)
**File:** [app/[lang]/(main)/for-developers/page.tsx](app/%5Blang%5D/(main)/for-developers/page.tsx) lines 59 and 91 (and any further `1fr 1fr` grids in that file — grep for `gridTemplateColumns: '1fr 1fr'`).
- Give each grid a className (`fd-grid-1`, `fd-grid-2`, …) and a single `<style>` block at the end of the page collapsing all of them to `1fr` at `max-width: 768px`, gap `40px`.

### Task 9 — (Optional refactor) Extract to a reusable CSS utility
If the same override block is repeated on 4+ pages, promote to `app/globals.css`:
```css
.editorial-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
.editorial-two-col__aside { border-left: 1px solid var(--border); padding-left: 60px; }
@media (max-width: 768px) {
  .editorial-two-col { grid-template-columns: 1fr; gap: 32px; }
  .editorial-two-col__aside { border-left: none; padding-left: 0; border-top: 1px solid var(--border); padding-top: 28px; }
}
```
Then replace the inline `style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', ... }}` usages with the class. Do this only after Tasks 1-8 ship and you've confirmed visual parity per page — avoid tangling the layout fix with a refactor.

---

## Verification checklist (after each task)

- [ ] Test viewports: 360px, 390px, 414px (iPhone), 768px (iPad portrait), 1024px (desktop breakpoint).
- [ ] No horizontal scroll.
- [ ] No truncated text in CTAs, labels, or placeholders.
- [ ] No sticky elements floating over other sections on mobile.
- [ ] Tap targets (buttons, links, selects) at least 40-44px tall on mobile.
- [ ] `var(--border)` dividers repositioned (top instead of left) when sections stack.
- [ ] `npm run build` still passes type check.
