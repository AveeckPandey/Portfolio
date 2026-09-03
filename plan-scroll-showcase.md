# Plan: ScrollShowcase — Greco-Roman classical, sequential per-project

## Concept

A folio of project tablets, presented one at a time as the user scrolls. Each
project occupies its own scroll "page" inside a single pinned section. The
aesthetic is **Greco-Roman classical**: aged parchment, Roman numerals, a
serif display face (Cinzel), an italic text face (Cormorant Garamond), warm
stone + gold accent, subtle paper texture, ornamental dividers.

## Visual system

### Palette
| token | value | use |
|-------|-------|-----|
| `--ink`     | `#2b1f12` (warm sepia) | primary text |
| `--ink-soft`| `#5a4630`            | body, secondary |
| `--parchment` | `#e9dcb8` (aged paper) | card / page background |
| `--parchment-deep` | `#d4c190`   | card edge, dividers |
| `--parchment-shadow` | `#a08560` | card drop shadow base |
| `--gold` | `#b8923a`             | accent, numerals, dividers |
| `--gold-deep` | `#8a6c20`        | accent on hover |
| `--cinnabar` | `#8b2e2e`          | wax-seal accent, error state |
| `--laurel` | `#5e6b3a`            | subtle ornament outline |

### Type
- Display: `Cinzel` (loaded via `next/font/google`, variable `--font-cinzel`)
  for project numerals and section headings.
- Body / titles: `Cormorant Garamond` (loaded similarly, variable
  `--font-cormorant`).
- Both loaded in `app/layout.tsx` alongside the existing three fonts.

### Texture
Inline SVG noise filter (`feTurbulence` + `feColorMatrix`) applied as a
low-opacity overlay on the parchment surface. No external image asset.

## Layout

```
<section id="demo">
  ┌────────────────────────────────────────────────────────┐
  │  I.  THE WORKS                                          │  ← numbered heading
  │                                                          │
  │  [wax-seal ring]  Roster — LinkedIn Job Post Automation │
  │  ┌─────────────────────────────────────────────┐       │
  │  │   [project visual placeholder]              │       │
  │  └─────────────────────────────────────────────┘       │
  │  Description body …                                       │
  │  ✦ n8n   ✦ Retool   ✦ MySQL   ✦ LinkedIn API            │
  │  → View live                                             │
  └────────────────────────────────────────────────────────┘
  (scroll → fade out, fade in next)
  ┌────────────────────────────────────────────────────────┐
  │  II.  THE WORKS                                          │
  │  [wax-seal]  Roster — Internal Analytics Dashboard     │
  │  …                                                       │
  └────────────────────────────────────────────────────────┘
  … (4 featured + 2 upcoming = 6 projects total)
  V.  CLI Dev Toolkit        (UPCOMING pill in the corner)
  VI. E-Commerce Backend     (UPCOMING pill in the corner)
  (scroll → section unpins → cream fade → existing <TearDivider/>)
```

Each project is a single folio "card" centered in the viewport, max-width
≈ `min(820px, 92vw)`. Only one project is visible at a time. The transition
between projects is the page turn.

## Scroll mechanics

**One pinned section, one master timeline.**

- Pin: `[data-scene-sticky]` over `data-scene-wrapper`
  (`Math.round(N * 110)%` of scroll distance).
- `scrub: 0.8` (tighter than the older 1.2 — feels more responsive).
- `pinSpacing: true` so the section unpins cleanly.
- `anticipatePin: 1` (kept).
- Per-project beats are sub-timelines tweened on the master timeline at
  explicit time offsets.

### Per-project beat (N out of 4)
For project index `i` ∈ [0, 3], the master timeline is divided into 4 equal
quarters. Within each quarter:

| t-offset within quarter | action |
|---|---|
| 0.00 | previous project opacity → 0, y → -40, rotateX → -6 |
| 0.05 | new project opacity → 1, y → 0, rotateX → 0 (expo.out) |
| 0.18 → 0.18 + k·0.06 | each `[data-rise]` child fades + rises (staggered) |

The "hold" beat at 0.70 in the previous design has been removed — the
project simply remains in place until the next quarter's clear-out starts.

### Pin distance math
N projects × ~1.1 viewport = `Math.round(N * 110)%` scrub. The wrapper's
height is driven entirely by `pinSpacing: true` — no manual `min-height`
needed.

### Lenis + ScrollTrigger coupling
- `lenis.on('scroll', ScrollTrigger.update)` (unchanged)
- `gsap.ticker.add(time => lenis.raf(time * 1000))` (unchanged)
- `gsap.ticker.lagSmoothing(0)` (unchanged)
- On unmount: `gsap.ticker.remove(...)`, `lenis.destroy()`, `ctx.revert()`.
  Order matters — Lenis first, then revert.

### Hash + progress feedback
A right-edge progress column shows current beat (I, II, III, IV) with a
vertical line. As scrub advances, the active numeral lights up. The class
toggle happens inside the master timeline's `onUpdate`.

## Components / files

### `components/ScrollShowcase.tsx`
- `'use client'`
- Imports: `useEffect`, `useRef` from `react`; `gsap` and `ScrollTrigger` from
  `gsap`; `Lenis` from `lenis`; styles from `./scroll-showcase.module.css`.
- Inline `PROJECTS` array of **6** entries, sourced from
  `content/software.ts`:
  - **folios I–IV**: the four `featured: true` items (CloudDeploy, API Gateway,
    Analytics, Task Queue).
  - **folios V–VI**: the two non-featured items (CLI Dev Toolkit, E-Commerce
    Backend), marked with `future: true`.
  Each mapped to:
  ```ts
  type Project = {
    id: string;
    numeral: "I" | "II" | "III" | "IV" | "V" | "VI";
    year: string;          // "MMXXV" or "MMXXVI"
    category: string;
    sealColor: string;     // wax-seal fill
    title: string;
    desc: string;
    stack: string[];
    metrics?: string[];
    link?: { label: string; href: string };
    future?: boolean;      // upcoming / in-progress
  };
  ```
- `ArrowRight` and `WaxSeal` are inline helper components in the same file.
- `useEffect` sets up Lenis, GSAP, ScrollTrigger with cleanup via
  `gsap.context().revert()`.

### `components/scroll-showcase.module.css`
- All new CSS scoped under `.demoRoot` (the prefix doesn't change, so the
  class on the section stays the same).
- New tokens for the classical palette.
- New classes: `.introBackdrop`, `.introSub`, `.introHeading`,
  `.sceneWrapper`, `.sceneSticky`, `.sectionLabel`, `.progressColumn`,
  `.progressMark`, `.progressMarkActive`, `.folioStack`, `.folio`,
  `.folioEmpty`, `.folioFuture`, `.folioSoon`, `.folioTop`, `.folioNumber`,
  `.folioNumberLabel`, `.folioCategory`, `.folioTitle`, `.waxSeal`,
  `.folioVisual`, `.folioVisualMark`, `.folioBody`, `.folioStackRow`,
  `.folioPill`, `.folioLink`, `.folioMetricsRow`, `.folioMetric`, `.creamFade`.

### `app/layout.tsx` (no change)
- Cinzel + Cormorant Garamond are already loaded.

### `app/page.tsx`
- One-line addition: import `ScrollShowcase` and place it between
  `<Projects />` and `<Experience />`, wrapped by `<TearDivider />`s.

## Reduced motion

If `(prefers-reduced-motion: reduce)`, the pin is disabled and the section
renders statically: the first folio is shown, all `[data-rise]` elements
are at their final state, the cream fade is hidden, and the progress mark
for the first project is lit. The CSS module also disables transitions
and animations under the same media query.

## What I will NOT do
- I will not change the existing `Projects` component, navbar, or homepage
  layout beyond the one import + one JSX line.
- I will not add a 5th project.
- I will not swap the placeholder visuals for real images — content
  decision, not animation decision.
- I will not add parallax layers or canvas effects — keeps the parchment
  feel pure, not gimmicky.
