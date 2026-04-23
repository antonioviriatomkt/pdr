# Portugal Developments Review — Motion Design System

> **Read this alongside `design-language.md`.** That document is the authoritative design reference. This document is a narrow extension of §9 *Motion and Interactivity*. It does not override anything in the design language; it specifies how the single motion allowance is implemented.

---

## 1. Operating principle

The platform is **static by design**. The global stylesheet disables all CSS animation and transition durations:

```css
*, *::before, *::after {
  animation-duration: 0.001ms !important;
  transition-duration: 0.001ms !important;
}
```

That rule **stays in place**. This motion system does not relax it site-wide. It introduces one — and only one — scoped exception: a route-change opacity fade.

Every other motion pattern named in the original brief (scroll-triggered reveals, stagger, hover micro-interactions, card scale, image zoom, parallax) is **explicitly out of scope**. Adding them requires a brand-level decision, not a motion-system edit.

---

## 2. What is allowed

| Pattern | Allowed? | Where |
|---|---|---|
| Route-change opacity fade | Yes | Wrapping `{children}` in `app/[lang]/layout.tsx` |
| Form state opacity change (e.g., submit button `0.6` while submitting) | Yes, pre-existing | Inline `style` on the disabled element |
| Input focus border color change | Yes, pre-existing, instant | `input:focus` in `globals.css` |

## 3. What is not allowed

- Scroll-triggered animations (`whileInView`, `IntersectionObserver` reveals, fade-up-on-scroll)
- Stagger effects on grids or lists
- Hover scale, lift, image zoom, card elevation
- Tap/press feedback beyond the browser default
- Page-section entrance animations
- Parallax, sticky-reveal, or any scroll-linked motion
- Loading skeletons or shimmer
- Icon or illustration animation
- Any animation of properties other than `opacity` (no `transform`, no `filter`, no `height`, no color fades)

If a future task requires any of the above, stop and raise it as a design-language change. Do not add it under this system.

---

## 4. The one allowance: route fade

### Behaviour

When the user navigates to a new route under `app/[lang]/...`, the new page content fades in from `opacity: 0` to `opacity: 1`. There is no exit animation — the old route unmounts instantly, the new route fades in. This matches the editorial register: the page simply resolves, rather than sliding, scaling, or crossfading.

### Specification

| Property | Value |
|---|---|
| Animated property | `opacity` only |
| From | `0` |
| To | `1` |
| Duration | `180ms` |
| Easing | `ease-out` (browser native, not a custom cubic-bezier) |
| Delay | `0` |
| Trigger | Pathname change (keyed remount of the wrapper) |
| Reduced-motion behaviour | Skipped entirely; content appears at `opacity: 1` immediately |
| Layout impact | None (opacity cannot trigger layout or paint of unchanged pixels) |

Duration sits at the lower end of the 150–250ms range the design language allows. It is long enough to read as intentional and short enough not to delay content. If it ever feels slow, shorten it — never lengthen it.

### Easing rationale

`ease-out` decelerates into the final state, which matches the "arriving, settling" feeling of an editorial page loading. `ease-in` or `linear` would feel mechanical; any bezier with overshoot would violate the "never bouncy" rule in §9.

### Accessibility

The fade is wrapped in `@media (prefers-reduced-motion: no-preference)`. Users who have requested reduced motion see the new route instantly, with no opacity transition. There is no JavaScript check — the behaviour is implemented in CSS so it cannot drift from the OS setting.

### Performance

Only `opacity` is animated. This is composited on the GPU on every major browser and does not trigger layout or paint of unchanged content. `will-change: opacity` is declared only on the fading element so the hint is scoped, not global.

---

## 5. Implementation

### Why not `framer-motion`

For a single opacity keyframe, `framer-motion` is ~50KB of runtime to do what one CSS `@keyframes` rule does natively. Adding the dependency would also normalise "we have a motion library, so add more motion" — the opposite of the brand's restraint. If a future scope expansion genuinely needs orchestrated motion, re-evaluate then.

### Files

- **`app/globals.css`** — scoped `.route-fade-in` class with `@keyframes` and a `prefers-reduced-motion` guard.
- **`components/RouteFade.tsx`** — client component that reads `usePathname()` and applies the class, keyed by pathname so the animation re-runs on each navigation.
- **`app/[lang]/layout.tsx`** — wraps `{children}` in `<RouteFade>`.

### Naming

- CSS class: `.route-fade-in` (singular purpose, literal name; there is no `.route-fade-out`).
- Keyframes: `@keyframes route-fade`.
- Component: `RouteFade`. Not `PageTransition`, `MotionWrapper`, or `AnimatedLayout` — those names imply a broader system that does not exist.

### No motion primitives library

The original brief called for `<FadeIn>`, `<SlideUp>`, `<StaggerContainer>` primitives. Under Option 2, building these primitives would advertise motion patterns the design language forbids. They are not created. If a primitive library is ever justified, it belongs with a design-language revision, not in this file.

---

## 6. Validation checklist

Before merging any change that touches motion:

- [ ] The only animated property is `opacity`.
- [ ] The only animation on the page is the route fade.
- [ ] `globals.css` still contains the global animation/transition kill-switch.
- [ ] `@media (prefers-reduced-motion: no-preference)` guards the keyframe rule.
- [ ] No new dependency has been added to `package.json` for motion.
- [ ] No component has `onHover`, `whileHover`, `whileInView`, `whileTap`, `animate`, or equivalent handlers.
- [ ] No inline `style` sets `transition` or `animation` on any component.
- [ ] Reduced-motion check passes manually (System Settings → Accessibility → Reduce Motion, on macOS).

---

## 7. Out-of-scope futures

If the owner later wants any of these, they are a scope change, not a system tweak:

- Hover affordances on cards or buttons (requires revising `design-language.md` §7 and §13)
- Scroll-triggered reveals (requires revising §9 and §13)
- Stagger on grids (requires revising §9 and §13)
- Loading states (requires new visual language — spinners, skeletons, progress)
- Cross-fade between routes (requires the old route to be retained during navigation, a structural change)

Each of these would reopen the conversation this system is deliberately closing.
