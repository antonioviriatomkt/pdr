# Motion Design — Task List

Scope: Option 2 (minimal, invisible motion). One route-change opacity fade. Nothing else.

Reference: `docs/motion-design-system.md`.

---

## Tasks

- [x] **1. Rulebook** — write `docs/motion-design-system.md` defining the single allowed motion (route fade), what is out of scope, and the validation checklist.
- [x] **2. Task list** — write this file.
- [x] **3. CSS escape hatch** — in `app/globals.css`, add the `.route-fade-in` class and `@keyframes route-fade` inside a `@media (prefers-reduced-motion: no-preference)` block. Use `!important` on `animation-duration` so it overrides the global `0.001ms` kill-switch. Leave the kill-switch itself untouched.
- [x] **4. RouteFade component** — create `components/RouteFade.tsx` as a client component. Read `usePathname()`. Render a wrapping `<div className="route-fade-in" key={pathname}>`. No framer-motion.
- [x] **5. Wire into layout** — in `app/[lang]/layout.tsx`, import `RouteFade` and wrap `{children}`. Do not touch metadata, JSON-LD, or generateStaticParams.
- [x] **6. Type check** — run `tsc --noEmit` (or `next build`) and confirm zero errors.
- [x] **7. Production build** — run `next build` and confirm the layout compiles.
- [x] **8. Reduced-motion manual check** — with macOS System Settings → Accessibility → Reduce Motion enabled, navigate between routes and confirm the new page appears instantly.
- [x] **9. Default-motion manual check** — with Reduce Motion disabled, navigate between routes and confirm a brief 180ms opacity fade-in on the new page.
- [x] **10. Validation checklist** — walk through every item in `motion-design-system.md` §6 and confirm it passes.

---

## Out of scope (do not implement under this task)

- `<FadeIn>`, `<SlideUp>`, `<StaggerContainer>` primitives
- Scroll-triggered animations (`whileInView`, `IntersectionObserver`)
- Hover, tap, or focus micro-interactions beyond the pre-existing input focus border
- Card elevation, image zoom, link underline transitions
- framer-motion dependency

If any of the above is requested, stop and reference the design-language conflict in `docs/motion-design-system.md` §7 before proceeding.
