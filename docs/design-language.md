# Portugal Developments Review — Design Language Reference

> **For AI models and human collaborators:** Read this file before making any UI/UX change or creating any new component, section, or page. Treat it as the authoritative design reference unless the user explicitly overrides it in the current session. When the live code and this file disagree, trust the code and update this file.

---

## Table of Contents

1. [Project Purpose](#1-project-purpose)
2. [Brand and UX Principles](#2-brand-and-ux-principles)
3. [Tone and Copy Guidance](#3-tone-and-copy-guidance)
4. [Layout System](#4-layout-system)
5. [Typography](#5-typography)
6. [Color and Surface Language](#6-color-and-surface-language)
7. [Components and Interaction Patterns](#7-components-and-interaction-patterns)
8. [Imagery and Art Direction](#8-imagery-and-art-direction)
9. [Motion and Interactivity](#9-motion-and-interactivity)
10. [Accessibility Expectations](#10-accessibility-expectations)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Rules for New Sections](#12-rules-for-new-sections)
13. [Do / Don't Guidance](#13-do--dont-guidance)
14. [Implementation Notes](#14-implementation-notes)
15. [Instructions for Future AI](#15-instructions-for-future-ai)
16. [Validation Checklist](#16-validation-checklist)

---

## 1. Project Purpose

**Portugal Developments Review** is a premium editorial platform that curates and presents exceptional new residential developments across Portugal. It is produced by Viriato, a real estate advisory firm, and serves as a high-quality discovery environment for discerning buyers — including international investors, Portuguese diaspora, affluent second-home seekers, and high-net-worth individuals considering Portugal as a primary or lifestyle residence.

The experience it is trying to create:
- A buyer arrives and immediately understands they are in a curated, authoritative environment — not a listings database.
- The platform communicates credibility through restraint, editorial voice, and visual discipline.
- Buyers trust the selection because the platform openly explains its methodology and does not pretend to be comprehensive.
- The site functions as a premium gateway between buyer and development: it connects, informs, and creates considered enquiries — not impulsive clicks.

**What this site is not:**
- Not a mass-market listings portal (like Idealista or Rightmove)
- Not a generic luxury real estate brand (with marble textures, gold accents, and hollow prestige signifiers)
- Not a brokerage-style property website (conversion-optimised, high-pressure, full of urgency tactics)
- Not a startup dashboard (with data visualisations, pill badges, gradient blobs, or product-style UI)
- Not a content farm or SEO-driven property blog

---

## 2. Brand and UX Principles

These principles govern every future UI and content decision. When in doubt, return to this list.

**Premium but restrained.**
The platform reads as sophisticated because of what it withholds — no rounded corners, no decoration, no animation noise. Visual confidence comes from proportion, not ornamentation.

**Editorial rather than promotional.**
Every section should feel like it was authored, not assembled. Copy is considered. Hierarchy is deliberate. Nothing shouts for attention; things simply present themselves with clarity.

**Selective rather than crowded.**
Content density is intentionally low. Three featured developments, not twelve. Section headers are not surrounded by noise. Whitespace is used as a design element, not wasted space.

**Trustworthy, calm, and high-signal.**
The platform should feel like a serious, quiet resource — comparable in feeling to a considered architecture publication or a private bank's market intelligence report. Nothing about it should feel excitable or reactive.

**Searchable and useful, but aesthetically disciplined.**
Utility (filter, browse, search, enquire) is present and clear — but it is embedded in the editorial frame. Navigation and filters should not dominate the page or break the visual register.

**Designed for discovery, curation, and clarity.**
The site helps buyers find the right development through location intelligence, editorial framing, and considered selection — not through sorting algorithms or comparison tables.

**A premium gateway, not a lead-gen funnel.**
The goal of every CTA is a considered, high-quality enquiry — not volume. The language, visual weight, and placement of calls to action should reflect this. Do not optimise for click-through at the expense of brand perception.

---

## 3. Tone and Copy Guidance

### Voice

The writing voice is: **clear, refined, intelligent, and understated.**

- Confident without sounding salesy.
- Formal but not stiff — warm in intent, precise in language.
- Authored, as if a thoughtful person with taste and domain expertise wrote each line.
- Specific over vague; particular over generic.

### What to avoid

| Avoid | Because |
|-------|---------|
| "Luxury living awaits" | Generic luxury cliché, hollow |
| "Don't miss out" | Urgency gimmick |
| "Best-in-class" / "World-class" | Startup cliché, meaningless |
| "Exclusive opportunity" | Brokerage language |
| "Register now" | Conversion-obsessed, pressuring |
| "Discover your dream home" | Consumer mass-market |
| "Limited availability" (as a tactic) | Fake urgency |
| "Seamless" / "cutting-edge" | Startup filler |
| Price-led headlines | Reduces development to a number |

### Copy patterns by context

**Section labels** (11px, uppercase, muted — above headings):
- Short, descriptive, factual.
- Examples: `Featured`, `Insights`, `Location Intelligence`, `Our Approach`, `For Developers`, `Enquiries`, `Platform`
- Not: `Discover`, `Explore`, `Exciting`, `New`

**Section headings** (h2, 28px, Georgia, weight 400):
- Definitive but not hyperbolic.
- Can be a statement, a question, or a simple noun phrase.
- Examples:
  - `Selected Developments`
  - `Browse by Location`
  - `How we select the developments on this platform.`
  - `Is your development exceptional enough to be considered?`
  - `Journal`
- Not: `Find Your Perfect Home`, `Explore Our Amazing Listings`, `Get Started Today`

**Introductory body text** (15–18px, muted, lineHeight 1.6–1.7):
- One or two clear sentences that frame the section's purpose or position.
- Example from homepage: *"An editorial platform for exceptional new residential projects — curated through independent selection, location intelligence, and premium presentation."*
- Avoid stacking superlatives. Let the specificity carry the weight.

**Primary CTAs** (uppercase, 13px, sans-serif):
- Active but unhurried.
- Examples: `Explore Developments`, `Read Our Methodology →`, `Learn More →`, `View All →`
- Not: `Get Started!`, `Buy Now`, `Claim Your Place`, `See More Amazing Homes`

**Secondary link CTAs** (uppercase, 12–13px, sans-serif, border-bottom underline):
- Lean, directional, with optional arrow.
- Examples: `All Developments →`, `All Articles →`, `View All →`, `Read Our Methodology →`

**Development editorial thesis** (14px, muted, max 2 lines):
- Why this development is here. What makes it worth considering.
- Example tone: *"A considered low-density development in Comporta that understands the landscape it sits within."*
- Not: *"Stunning beachfront luxury apartments — incredible views and investment potential!"*

**Form labels** (11px, uppercase, 0.08em tracking, muted):
- Short, direct.
- Examples: `Full name`, `Email address`, `Development interest`, `Message`
- Not: `Please enter your full name below`

---

## 4. Layout System

### Container

The single layout container is `.container-editorial`:

```css
.container-editorial {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;        /* desktop */
}

@media (max-width: 768px) {
  .container-editorial {
    padding: 0 1.25rem;   /* mobile */
  }
}
```

All content sits inside this container. Never extend content edge-to-edge unless you are deliberately using a full-bleed background color change on the `<section>` element itself (e.g., `background: var(--surface)`), with the content still inside `.container-editorial`.

### Section padding

| Type | Padding |
|------|---------|
| Standard content section | `64px 0` |
| Hero section | `80px 0 72px` |
| Compact navigation strip | `20px 0` |
| Alternative (lighter) | `56px 0` or `48px 0` |

Every section has `borderBottom: '1px solid var(--border)'` except the final section on a page (which has no bottom border — the footer provides separation).

### Grid patterns

**Auto-fit cards (3-up)** — used for featured developments, journal articles:
```js
gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
gap: '40px'
```

**Auto-fill location tiles** — creates a ruled grid with 1px borders between tiles:
```js
gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'
gap: '1px'
border: '1px solid var(--border)'
background: 'var(--border)'  // border bleeds through gap as tile separator
```
Each tile has `background: 'var(--background)'` to sit against the border background.

**Two-column editorial split** — used for methodology/editorial sections:
```js
gridTemplateColumns: '1fr 1fr'
gap: '60px'
alignItems: 'start'
```
The right column often has `borderLeft: '1px solid var(--border)'` and `paddingLeft: '60px'`.

**Detail page with sidebar** — development and article detail pages:
```js
gridTemplateColumns: '1fr 360px'   // development detail
gridTemplateColumns: '1fr 280px'   // article detail
gap: '60px'
```
Sidebar is sticky at `top: '80px'`.

### Visual rhythm

- Section label → heading is always `label at 11px muted` then `heading at 24–28px` with 6–10px between them.
- Section heading → content has `marginBottom: '40px'` on the header block.
- Horizontal section introductions use `justifyContent: 'space-between'` with the section title on the left and a secondary `View All →` link on the right, aligned to baseline.
- Lists use em-dash `—` as a bullet character (not `•` or `*`).

---

## 5. Typography

### Fonts

**Serif (primary) — used for all headings and body text:**
```css
font-family: 'Georgia', 'Times New Roman', serif;
```

**Sans-serif (secondary) — used for navigation, labels, buttons, form elements, metadata:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
```

The Tailwind utility class `.font-sans` maps to the sans-serif stack.

### Scale

| Role | Size | Weight | Line-height | Letter-spacing | Font |
|------|------|--------|-------------|----------------|------|
| Hero h1 | `clamp(32px, 5vw, 52px)` | 400 | 1.15 | -0.02em | Serif |
| Section h2 | 24–28px | 400 | 1.2–1.25 | -0.01em | Serif |
| Card title / h3 | 18–20px | 400 | 1.2–1.3 | -0.01em | Serif |
| Intro body | 18px | 400 | 1.6 | — | Serif |
| Body text | 15–16px | 400 | 1.6–1.7 | — | Serif |
| Secondary body | 14px | 400 | 1.5–1.7 | — | Serif |
| Small text / captions | 13–14px | 400 | 1.5 | — | Serif |
| Section labels | 11px | 400 | 1.5 | 0.1em | Sans-serif |
| Navigation links | 13px | 400 | — | 0.02em | Sans-serif |
| Form labels | 11px | 500 (or 400) | 1.5 | 0.06–0.1em | Sans-serif |
| Button / CTA | 12–13px | 400 | — | 0.06–0.08em | Sans-serif |
| Metadata | 11–13px | 400 | 1.5 | 0.04–0.1em | Sans-serif |

### Key rules

- **Weight is always 400.** No bold, no medium weight on headings or body text. Weight contrast comes from size, not weight.
- **Headings are optically tightened.** All headings use negative letter-spacing (`-0.01em` to `-0.02em`).
- **Labels and buttons are tracked out.** All uppercase sans-serif elements use positive letter-spacing (`0.04em` to `0.12em`).
- **Upper-case is used sparingly and deliberately** — for labels, categories, button text, and metadata only. Never for body copy or headings.
- **No italics** in the current codebase. Do not introduce them without strong reason.
- **Clamp is used for hero headings** to scale fluidly between mobile and desktop without abrupt jumps.

---

## 6. Color and Surface Language

### Design tokens (defined in `app/globals.css`)

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#F7F6F3` | Main page background — warm off-white |
| `--foreground` | `#1A1A1A` | Primary text, buttons, icons — near-black |
| `--muted` | `#6B6B6B` | Secondary text, labels, metadata — mid-gray |
| `--border` | `#D8D5CE` | All 1px dividers, tile grid lines — warm taupe |
| `--surface` | `#EFEDE8` | Alternate section background — slightly darker cream |
| `--accent` | `#1A1A1A` | Same as foreground (used for emphasis contexts) |

Tailwind theme aliases are set via `@theme inline` and map as `bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-surface`.

### Usage rules

**Background alternation:**
Sections alternate between `var(--background)` (default) and `var(--surface)` for visual separation without introducing new colors. The surface tone is used for: the location quick-nav strip, the Browse by Location section, and the Developer invitation section.

**Text hierarchy:**
- `var(--foreground)` → primary headings, active states, primary button labels, high-emphasis content
- `var(--muted)` → secondary text, body copy inside informational sections, labels, metadata, categories

**Borders:**
- All borders are `1px solid var(--border)` — no thicker lines, no different colors.
- Borders provide structure, not decoration. They separate sections, create tile grids, and delineate sidebar panels.
- The location tile grid uses `background: var(--border)` on the grid container with `gap: 1px` to create hairline separators.

**Buttons:**
- Primary: `background: var(--foreground)`, `color: var(--background)` — dark fill, light text.
- Secondary: `border: 1px solid var(--border)`, `color: var(--foreground)` — outline, no fill.
- Neither uses any color other than the defined tokens.

**Error state:**
- The only non-token color in the codebase is `#B91C1C` (red) for form error messages. This should remain isolated to error states only.

### What to avoid

- **No gradients** — not even subtle ones. The palette is flat.
- **No shadows** — no `box-shadow` anywhere. Depth comes from border lines, not elevation.
- **No new colors** — if a new color seems necessary, first ask whether the existing token set can carry it. Do not introduce new color variables without a strong system-level reason.
- **No bright accent colors** — no blue, teal, green, orange, or any saturated hue. The palette is deliberately warm-neutral.
- **No transparency tricks** — no rgba overlays, no frosted glass, no blurred backgrounds.

---

## 7. Components and Interaction Patterns

All components use inline styles. There are no component-level CSS modules or styled-components. Styling is applied directly via the `style` prop in React.

### Header (`components/Header.tsx`)

**Role:** Global navigation and brand identity.

**Structure:**
- Logo: `"Portugal Developments Review"` in 13px uppercase sans-serif (weight 500, tracking 0.08em) + `"by Viriato"` in 11px muted sans-serif.
- Nav links: 13px sans-serif, muted color, 32px gap, 0.02em tracking.
- CTA: `"Enquire"` — 12px uppercase sans-serif, foreground background, 8px 16px padding.
- Total header height: 64px.
- Mobile breakpoint: 768px — desktop nav hides, hamburger appears.
- Mobile menu: full-width stacked links with border-bottom on each item.

**Do not:**
- Add a sticky/fixed position to the header (currently it scrolls away).
- Add background blur, shadow, or translucency effects.
- Add more than one CTA to the header.
- Change the logo typography to serif.

---

### Footer (`components/Footer.tsx`)

**Role:** Site-wide links, brand reinforcement, and copyright.

**Structure:**
- Grid: `repeat(auto-fit, minmax(180px, 1fr))`.
- Four columns: Brand (with tagline), Developments, Journal, Platform.
- Column titles: 11px uppercase sans-serif, 0.1em tracking, muted.
- Links: 13px sans-serif, muted.
- Copyright line: year auto-generated, muted, 12px.

---

### DevelopmentCard (`components/DevelopmentCard.tsx`)

**Role:** Primary content unit for surfacing developments in grids and lists.

**Default variant:**
- Image block: 4:3 aspect ratio (`paddingBottom: '75%'`), `background: var(--surface)`.
- Featured badge: 10px uppercase, `var(--surface)` background, positioned top-left over image.
- Meta line: `Location · Status · Type` — 11px uppercase sans-serif, muted, 0.08em tracking.
- Title: 20px serif, weight 400.
- Editorial thesis: 14px serif, muted, 2-line `-webkit-line-clamp`.
- Footer: price range (13px) left-aligned, `"View →"` (12px uppercase sans-serif) right-aligned.
- Lifestyle tags: 10px uppercase sans-serif, border, muted — max 3 shown.

**Compact variant (no image):**
- Used in article sidebars and related sections.
- Meta + title + price in minimal layout.
- Separated from adjacent items with `borderBottom: '1px solid var(--border)'`.

**Do not:**
- Add hover effects, image zoom, or card elevation.
- Add more than 3 lifestyle tags.
- Use bold text for title or price.
- Change the image aspect ratio without reconsidering the grid.

---

### ArticleCard (`components/ArticleCard.tsx`)

**Role:** Content unit for journal articles in grids and lists.

**Default variant:**
- Image block: 16:10 aspect ratio (`paddingBottom: '62.5%'`), `background: var(--surface)`, with centered 11px uppercase category label.
- Meta: `Category · Location` — 11px uppercase sans-serif, muted.
- Title: 18px serif, weight 400, 1.3 line-height.
- Excerpt: 14px serif, muted, 2-line clamp.
- Date: 12px sans-serif, muted.

**Compact variant (no image):**
- Used in development page sidebars.
- Meta + title in list format.

---

### Buttons

**Primary button** — used for the main action in a section or form:
```js
{
  background: 'var(--foreground)',
  color: 'var(--background)',
  padding: '14px 28px',        // or '16px' full-width
  fontSize: '13px',
  fontFamily: 'sans-serif',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer'
}
```

**Secondary button** — used for alternative actions:
```js
{
  border: '1px solid var(--border)',
  color: 'var(--foreground)',
  padding: '14px 28px',
  fontSize: '13px',
  fontFamily: 'sans-serif',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  background: 'var(--background)'
}
```

**Toggle button** — used for active/inactive CTA type selection:
```js
{
  padding: '8px 12px',
  fontSize: '13px',
  background: isActive ? 'var(--foreground)' : 'transparent',
  color: isActive ? 'var(--background)' : 'var(--muted)',
  border: `1px solid ${isActive ? 'var(--foreground)' : 'var(--border)'}`
}
```

Never use: rounded corners (global reset prevents it), gradient fills, colored fills other than foreground, or shadow effects.

---

### Form inputs

```js
{
  width: '100%',
  padding: '11px 14px',
  fontSize: '14px',
  fontFamily: 'sans-serif',
  border: '1px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  borderRadius: '0',
  outline: 'none'
}
// On focus: border-color → var(--foreground)
```

**Labels:**
```js
{
  fontSize: '11px',
  fontFamily: 'sans-serif',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  display: 'block',
  marginBottom: '6px'
}
```

**Form states:**
- Submitting: `opacity: 0.6–0.7`, `cursor: not-allowed` on the submit button.
- Success: Confirmation message in a `var(--surface)` box with muted text.
- Error: Message in `color: '#B91C1C'` (the only non-token color in the system).

---

### Section header pattern

The consistent pattern used above content grids:
```jsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
  <div>
    <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
      Label
    </p>
    <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
      Section Title
    </h2>
  </div>
  <a style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
    View All →
  </a>
</div>
```

If no secondary link is needed, omit the flex wrapper and use a simple `<div>` with the label and heading stacked.

---

### Link patterns

| Type | Style |
|------|-------|
| Primary inline CTA | `borderBottom: '1px solid var(--foreground)'`, `color: var(--foreground)` |
| Secondary inline CTA | `borderBottom: '1px solid var(--border)'`, `color: var(--muted)` |
| Arrow CTA | Append `→` with a space: `"Learn More →"` |
| Nav link | No underline, `color: var(--muted)` |
| Active/current nav | No underline, `color: var(--foreground)` |

All links: `text-decoration: none` (set globally). No hover color change (animations disabled).

---

### List pattern (em-dash bullet)

Used in the Methodology section and wherever criteria or features are listed:
```jsx
<div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>
  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>—</span>
  <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
    Item text
  </p>
</div>
```

Never use `<ul>` with default `•` bullets for this pattern.

---

## 8. Imagery and Art Direction

### What fits

- Architecture photography that emphasises geometry, material, and space — not lifestyle staging.
- Natural environments: coastal light, stone, olive groves, terracotta, water.
- Aerial or elevated shots that communicate site, scale, and context.
- Interior photography with restraint — no deliberately styled props or aspirational clutter.
- Photography with a quiet, observational quality — not editorial magazine maximalism.

### What to avoid

- Overly saturated or heavily post-processed photography.
- Generic luxury lifestyle imagery (infinity pools with models, champagne, white sofas in impossible light).
- Stock photography that looks unrelated to Portugal or architecture.
- Image collages or multi-image tiles that create visual noise.
- Heavy text overlays on images.

### Image treatment in components

- Aspect ratios: 4:3 for development cards, 16:10 for article cards.
- Images fill their container via `object-fit: cover`.
- Image background before load: `var(--surface)` — the warm cream placeholder preserves the palette.
- No overlay gradients on images (even subtle ones break the flat visual language).
- No border-radius (enforced globally).
- No image borders or frames.

### Image placement

- Imagery leads sections where it carries context: development detail, article hero.
- Imagery supports without dominating: card thumbnails are contained, not full-bleed unless it is an intentional hero moment.
- When no image is available, the `var(--surface)` placeholder sits cleanly without being replaced by icons or broken states.

---

## 9. Motion and Interactivity

### Current state: static by design

The global stylesheet disables all animations and transitions:
```css
*, *::before, *::after {
  animation-duration: 0.001ms !important;
  transition-duration: 0.001ms !important;
}
```

This is an intentional design decision, not a technical limitation. The platform reads as editorial and composed precisely because it does not react to user input with movement. Everything is immediate.

### Interaction patterns that do exist

- **Mobile menu toggle:** State-driven show/hide — no animation, the menu appears and disappears instantly.
- **Form states:** Submit button opacity changes on submission — rendered as immediate state updates, no animated fade.
- **Focus states on form inputs:** Border color changes to `var(--foreground)` — no transition, immediate.
- **Sticky sidebar panels** on detail pages: `position: sticky`, `top: 80px` — the sidebar scrolls with the page until it locks.

### Guidance for future motion

If motion is introduced in future (e.g., page transitions, scroll-triggered reveals), it must:
- Be subtle and purposeful — never decorative or attention-seeking.
- Use durations of 150–250ms maximum.
- Use easing curves that feel physical, not bouncy (`ease-out` or `cubic-bezier`).
- Respect `prefers-reduced-motion` — wrap in a media query and fall back to instant display.
- Never be used to compensate for weak visual hierarchy.

Do not introduce: parallax scrolling, scroll-triggered animations, attention loops, loading skeletons, or any animation that delays the display of content.

---

## 10. Accessibility Expectations

### Semantic HTML

- Use proper landmark elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`.
- Heading hierarchy must be maintained: one `<h1>` per page, followed by `<h2>`, `<h3>` in logical order. Do not skip levels.
- `<p>` for paragraph text, not `<div>` with font styling.
- `<ul>` and `<li>` for true lists — but use the em-dash `<div>` pattern for styled criteria lists.

### Contrast

- `var(--foreground)` (#1A1A1A) on `var(--background)` (#F7F6F3) — high contrast, passes WCAG AA and AAA.
- `var(--muted)` (#6B6B6B) on `var(--background)` (#F7F6F3) — passes AA for normal text at 14px+. Do not reduce this further.
- Primary buttons (foreground on background) — passes AA.

### Focus

- Form inputs have a visible focus state (foreground border).
- Interactive elements (links, buttons) should maintain browser default focus outlines unless a custom visible replacement is provided.
- Do not use `outline: none` on non-form elements.

### Forms

- Every `<input>`, `<select>`, and `<textarea>` must have an associated `<label>` with matching `for`/`id` attributes, or `aria-label`.
- Avoid placeholder-only labels (placeholder disappears on input, leaving the user without context).

### Images

- All `<img>` and Next.js `<Image>` components must have descriptive `alt` text.
- Decorative images (e.g., purely atmospheric photography) should use `alt=""`.

### Reduced motion

If any animation is added in future, wrap it in:
```css
@media (prefers-reduced-motion: no-preference) {
  /* animation goes here */
}
```

### Keyboard navigation

- All interactive elements must be reachable and operable by keyboard.
- Mobile menu toggle button has `aria-label="Toggle menu"` — maintain this pattern.
- Card links wrap the entire card in `<Link>` — ensure the link label is descriptive (development/article title carries the context).

---

## 11. Responsive Behavior

### Single breakpoint

The project uses a single mobile breakpoint: **768px**.

Above 768px: desktop layout (multi-column grids, full nav, sidebar layouts).  
Below 768px: mobile layout (single column, hamburger nav, reduced padding).

### What changes at 768px

| Element | Desktop | Mobile |
|---------|---------|--------|
| Container padding | `0 2rem` | `0 1.25rem` |
| Header nav | Horizontal with links | Hidden; hamburger toggle |
| Card grids (`auto-fit minmax 280px`) | 2–3 columns | 1 column |
| Location tile grid (`auto-fill minmax 240px`) | 2–4 columns | 1–2 columns |
| Two-column editorial splits (`1fr 1fr`) | Side by side | Stacks (add `@media` or swap to `auto-fit`) |
| Detail page sidebars (`1fr 360px`) | Two columns | Should stack with sidebar below |
| Hero h1 | `clamp(32px, 5vw, 52px)` — larger | `clamp(32px, 5vw, 52px)` — smaller end of clamp |

### What stays consistent

- The color palette, typography scale, and section structure do not change at any breakpoint.
- Section padding remains generous even on mobile (48–64px vertical).
- Section labels and heading patterns remain identical.
- The editorial voice, copy, and content do not change for mobile.

### Building responsively

For new sections with multi-column layouts, prefer `repeat(auto-fit, minmax(...px, 1fr))` over hard-coded column counts — it handles the mobile collapse automatically. Where a layout absolutely needs a media query for mobile, add an inline `<style>` block or use a conditional style pattern consistent with how Header.tsx handles its mobile override.

---

## 12. Rules for New Sections

Follow these rules every time a new section, page, or component is created.

### Before writing any code

1. Read the sections immediately adjacent to where the new section will appear. Match their spacing, heading size, and label pattern.
2. Identify whether the new section uses an existing grid pattern (auto-fit cards, location tile grid, two-column split, or single-column text) — use the existing pattern before inventing a new one.
3. Confirm the background: `var(--background)` or `var(--surface)`? Alternate from the section before it.
4. Identify the section label — it must follow the established label pattern (11px, uppercase, sans-serif, muted).

### Layout and spacing

- Standard section padding: `64px 0`. Do not deviate without reason.
- Content inside `.container-editorial` always.
- `borderBottom: '1px solid var(--border)'` on every section except the last on the page.
- `marginBottom: '40px'` on the section header block (label + title group).
- Gaps within grids: `40px` for cards, `60px–80px` for multi-column editorial splits.

### Typography in new sections

- Section label: 11px, uppercase, sans-serif, `var(--muted)`, letterSpacing 0.1em.
- Section heading (h2): 24–28px, serif, weight 400, letterSpacing -0.01em.
- Body text: 14–16px, serif, `var(--muted)`, lineHeight 1.6–1.7.
- Do not introduce a new font size that does not exist in the scale above.
- Do not use weight 500, 600, or 700 anywhere.

### CTAs in new sections

- One primary action per section. A secondary action is acceptable (the established pattern is a primary block button + a secondary outline button in the hero, or an inline link CTA in most other sections).
- Do not add more than two CTAs to a single section.
- CTA copy must follow the established voice — not salesy, not urgent, not hyperbolic.

### Visual inventions

- Do not introduce new colors, even as one-off inline values.
- Do not add gradients, shadows, or border-radius.
- Do not introduce animations or transitions.
- Do not introduce new icon systems or SVG decorations — the current design uses no icons.
- Do not add badges, chips, tags, or status pills beyond what the DevelopmentCard already uses (lifestyle tags at 10px).

### Reuse before creating

- If a heading, intro paragraph, card, or CTA pattern already exists, replicate it directly.
- Do not abstract into a new component unless the same pattern is used in three or more places and the abstraction genuinely reduces maintenance burden.

---

## 13. Do / Don't Guidance

### Do

- Maintain elegant visual restraint. When in doubt, remove.
- Use whitespace as structure — large gaps (40–80px) between content blocks.
- Preserve the curated, authored feel. Every section should feel like it was placed with intention.
- Follow the label → heading → content hierarchy in every section.
- Use `var(--muted)` for supporting text. Reserve `var(--foreground)` for headings and primary emphasis.
- Keep CTAs understated — uppercase, small font, no decorative treatment.
- Use the em-dash list pattern for criteria and feature lists.
- Alternate section backgrounds between `var(--background)` and `var(--surface)`.
- Keep card content concise — titles at 1 line where possible, excerpts at 2 lines maximum.
- Write copy that is precise and specific about Portugal, architecture, and development quality.

### Don't

- Don't create portal-like density: too many cards, too much information, too many CTAs competing.
- Don't add loud gradients, background textures, or multi-color schemes.
- Don't use rounded corners (the global CSS reset prevents this, but do not attempt to override it).
- Don't add animations, transitions, or scroll effects unless `prefers-reduced-motion` is respected.
- Don't use bold text anywhere in the main UI. Weight 400 only.
- Don't write copy that uses urgency tactics, superlatives, or brokerage language.
- Don't introduce icons, illustration, or decorative SVG.
- Don't use inline `<br>` tags to control text wrapping — adjust font size or container width instead.
- Don't place more than one `<h1>` on a page.
- Don't stack multiple text blocks of the same color and size without hierarchy.
- Don't add `box-shadow` anywhere.
- Don't use `position: absolute` for decorative layering effects.
- Don't make the filter or search UI the most visually dominant element in a page.
- Don't add fake social proof, testimonial carousels, or review widgets.
- Don't introduce map embeds, data visualisation widgets, or chart components without explicit discussion of how they fit the visual language.

---

## 14. Implementation Notes

### File structure

```
/app
  layout.tsx          — Root layout: imports Header and Footer, sets metadata
  page.tsx            — Homepage (all sections inline, no sub-components)
  globals.css         — Design tokens and global resets
  /developments/...   — Developments listing and detail pages
  /locations/...      — Location pages
  /journal/...        — Journal listing and article pages
  /methodology/...    — Methodology page
  /about/...          — About page
  /contact/...        — Contact / enquiry page
  /studio/...         — Sanity Studio route (not part of the public site)

/components
  Header.tsx          — Global navigation (client component)
  Footer.tsx          — Global footer
  DevelopmentCard.tsx — Development card (default + compact variants)
  ArticleCard.tsx     — Article card (default + compact variants)

/lib
  demo-data.ts        — Static demo data (used until Sanity is populated)
  sanity.client.ts    — Sanity client configuration
  sanity.queries.ts   — GROQ queries

/sanity
  /schemas/...        — Sanity document and object schemas
  sanity.config.ts    — Sanity Studio configuration
```

### Styling conventions

- **All styling is via inline `style` props** — there are no component-level CSS files, CSS modules, or Tailwind utility classes on UI elements (the only Tailwind usage is `className="container-editorial"` and `className="font-sans"`).
- This means when reading or writing component code, look for `style={{ ... }}` objects, not class names.
- CSS variables are the design tokens. Always reference `var(--background)`, `var(--foreground)`, etc. — never use raw hex values in component styles (the only exception is `#B91C1C` for error states).

### Container

Always wrap section content in:
```jsx
<div className="container-editorial">
  {/* content */}
</div>
```

This is the only shared layout class. Do not create additional layout utility classes.

### Variants pattern

`DevelopmentCard` and `ArticleCard` both accept a `variant` prop (`'default'` | `'compact'`). Follow this pattern when creating future card components that need list vs. grid display modes.

### Demo data

`/lib/demo-data.ts` contains static mock data for all content types. This is used on all pages until Sanity CMS is connected. When Sanity is live, pages should switch to GROQ queries defined in `sanity.queries.ts`. Do not delete demo data — it is used to validate layout and design in development.

### Sanity content structure

The platform manages four document types:
- `development` — the primary content unit
- `location` — geographic areas with market context
- `journalArticle` — editorial content
- `developer` — developer profiles

Key fields relevant to UI:
- `development.isFeatured` → controls appearance in the Featured section
- `development.editorialThesis` → the 1–2 sentence editorial rationale shown in cards
- `development.lifestyleTags` → up to 3 tags shown at bottom of card
- `development.primaryCta` → which enquiry CTA to show on the detail page
- `journalArticle.category` → shown as image label and filter

### Resend integration

Email from forms is sent via the Resend API. The integration is in the API routes under `/app/api/`. The email address is configured via environment variable.

---

## 15. Instructions for Future AI

You are reading this file because you are about to make a UI, UX, or design decision for Portugal Developments Review.

**Before you write any code:**

1. Read this file fully. Do not skim it.
2. Open and read the files adjacent to where you are working. Understand the existing pattern before writing new code.
3. If you are creating a new section: match the exact padding, label, heading, and grid patterns documented above. Do not invent alternatives.
4. If the user has asked for something that would violate these principles (e.g., "add a bold headline", "add some hover animations", "make it more colourful"), flag the conflict before proceeding and propose how to achieve the intent within the existing system.

**When this file and the live code disagree:**
Trust the live code. Then update this file to reflect what is actually true.

**When you are uncertain:**
Default to restraint. If adding something feels like it might break the visual calm of the platform, it probably will. Ask first.

**What this file cannot tell you:**
The exact wording of future copy. That requires the owner's editorial voice. Surface a draft and request review rather than publishing unreviewed copy.

---

## 16. Validation Checklist

Use this checklist before considering any new section or component complete.

### Visual language
- [ ] Background is `var(--background)` or `var(--surface)` — no other background color
- [ ] All text uses `var(--foreground)` or `var(--muted)` — no other text color
- [ ] All borders are `1px solid var(--border)` — no other border style
- [ ] No border-radius (enforced by CSS reset, but verify no override was added)
- [ ] No box-shadow
- [ ] No gradient
- [ ] No animation or transition (unless `prefers-reduced-motion` is respected)

### Typography
- [ ] Headings use Georgia serif at weight 400
- [ ] Section label is 11px, uppercase, sans-serif, muted, letter-spacing 0.1em
- [ ] No font weight above 400 in main content
- [ ] No italic text
- [ ] All uppercase text is sans-serif (labels, buttons, metadata — never body copy or headings)

### Layout
- [ ] All content inside `.container-editorial`
- [ ] Section has `borderBottom: '1px solid var(--border)'` (unless it is the last section on the page)
- [ ] Section padding is 48–80px vertical
- [ ] Section header block has `marginBottom: '40px'`

### Copy and voice
- [ ] No urgency language, superlatives, or brokerage phrases
- [ ] CTA copy is calm, directive, and unhurried
- [ ] Section label is short and factual
- [ ] Section heading is definitive without being promotional

### Functionality
- [ ] Form inputs have associated labels
- [ ] Images have `alt` attributes
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skips)
- [ ] Component is tested at 375px (iPhone) and 1280px (desktop)
- [ ] Mobile layout collapses cleanly without overflow or horizontal scroll
