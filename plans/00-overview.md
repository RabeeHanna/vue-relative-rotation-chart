# vue-relative-rotation-chart — Project Overview

**Package name:** `vue-relative-rotation-chart`  
**Public positioning:** A Vue SVG component for rendering RRG-style relative rotation charts from precomputed relative strength and momentum data.  
**Stack:** Vue 3 · TypeScript · Vite · Custom SVG renderer · D3 (math/helpers only)  
**Repo:** Standalone from day one — consumed by a host application via `file:` / workspace link  
**Date started:** July 2026

---

## What This Is

A custom SVG-based chart component that replaces an ECharts-based RRG renderer in the host application. The renderer consumes already-calculated RRG point series and renders them as an interactive SVG chart optimised for readability:

- clearer axes
- readable ticker labels (no cluster fusing)
- easier-to-follow trails with opacity fade
- stable viewport behavior
- better hover/selection
- Playwright/agent inspectability via real DOM elements

This project **only replaces the chart renderer**. It does not touch price data, RRG calculations, cache behavior, or any backend.

---

## What This Is Not

- Not a data fetcher
- Not a calculation engine
- Not a JdK RRG clone or official implementation
- Not a Canvas/WebGL renderer (v1 is SVG only)
- Not a full UI replacement for the host application

---

## Design Principles

**HOST-FIRST, PUBLIC-LATER**

v1 is optimised for the primary consumer's RRG use case:
- Fixed quadrant definitions (leading/weakening/lagging/improving)
- Specific tail interpretation (RS-Ratio × RS-Momentum series)
- Date-based replay (not real-time streaming)
- 11–50 ticker range
- Host color palette and playback pattern

Public genericization is deferred to v2. The API may change between v1 and public release.

**Vue owns the DOM. D3 provides math.**

D3 is used only as a utility layer: scales, axis/tick generation, line/path generation. Vue owns all rendering through declarative SVG templates.

---

## Core Types (Adapter Boundary)

```ts
export type RrgRenderPoint = {
  ticker: string
  label: string
  name?: string
  x: number
  y: number
  quadrant: 'leading' | 'weakening' | 'lagging' | 'improving'
  color?: string
}

export type RrgRenderSeries = {
  ticker: string
  label: string
  name?: string
  points: Array<{
    date: string
    x: number
    y: number
    quadrant: 'leading' | 'weakening' | 'lagging' | 'improving'
  }>
  color?: string
  visible?: boolean
}

export type RrgChartInput = {
  selectedDate: string
  series: RrgRenderSeries[]
  tailLength: number
  viewportMode: 'fit' | 'max' | 'center'
}
```

These types protect the component from host-application-specific state shape.

---

## Component API (Target)

```vue
<RrgChart
  :series="series"
  :selected-date="selectedDate"
  :tail-length="tailLength"
  :viewport-mode="viewportMode"
  :label-mode="labelMode"
  :width="width"
  :height="height"
  @point-hover="handlePointHover"
  @point-click="handlePointClick"
  @point-leave="handlePointLeave"
/>
```

---

## Units of Work

| Unit | Title | Phase | Est. |
|------|-------|-------|------|
| [PRE-C1-A](./PRE-C1-A-label-collision-spike.md) | Label Collision Algorithm Spike (**done — Spatial Bin**) | Pre-Start | 1 day |
| [PRE-C1-B](./PRE-C1-B-outlier-strategy.md) | Fit Mode Outlier Strategy Decision (**done — Fit-All**) | Pre-Start | 0.5 day |
| [PRE-C1-C](./PRE-C1-C-accessibility-requirements.md) | Colorblind Accessibility Requirement (**done**) | Pre-Start | 0.5 day |
| [C1](./C1-skeleton.md) | Component Project Skeleton (**done**) | Foundation | 1–2 days |
| [C2](./C2-types.md) | Public Data Contract and Types (**done**) | Foundation | 0.5–1 day |
| [C3](./C3-axes-quadrants.md) | Static SVG Axes and Quadrants (**done**) | Foundation | 1–2 days |
| [C4](./C4-points.md) | Points and Current Frame Rendering (**done**) | Foundation | 1 day |
| [C5](./C5-tails.md) | Tail Rendering (**done**) | Rendering Core | 2–3 days |
| [C8](./C8-viewport.md) | Viewport Modes (**done**) | Rendering Core | 1–2 days |
| [C6](./C6-label-collision.md) | Label Collision System (**done**) | Rendering Core | 3–5 days |
| [C7](./C7-hover-events.md) | Hover, Tooltip, and Selection Events (**done**) | Interaction | 1–2 days |
| [C12](./C12-playback-controls.md) | Playback Controls (**done**) | Interaction | 1–2 days |
| [C9](./C9-accessibility.md) | Accessibility and Agent-Testability (**done**) | Polish | 1 day |
| [C11](./C11-adversarial-review.md) | Adversarial Review and Polish (**done**) | Polish | 2–3 days |
| [C13](./C13-demo-playground.md) | Demo Playground (**done**) | Demo / Polish | 2–3 days |
| [C13.5](./C13.5-demo-sessions.md) | Demo Session Persistence (**done**) | Demo / Polish | 0.5 day |
| [C14](./C14-public-release.md) | Public Release Hygiene (**done**) | Packaging / Trust | 1–2 days |
| [C15](./C15-tail-hover.md) | Tail Hit-Target Hover (**done**) | Interaction / Polish | 1–2 days |
| [C16](./C16-optimization.md) | Render / Playback Optimization (**done**) | Performance | 2–4 days |
| [C17](./C17-performance-profiling.md) | Performance Testing & Profiling (**done**) | Performance / Quality | 2–4 days |
| [C18](./C18-pre-npm-polish.md) | Pre-npm Polish — Review Artifacts + Public API / Docs (**done**) | Polish / Trust | 2–3 days |
| [C19](./C19-first-public-publish.md) | First Public Publish — Rotation Specialist npm Cut (**draft** — [scrutiny](./C19-public-library-scrutiny.md)) | Packaging / Trust | 1–2 days |
| [C19.5](./C19.5-demo-ux-simplify.md) | Demo UX — Simple / Customize Split (**done**) | Demo / Polish | 0.5–1 day |
| [C20](./C20-bundle-size-perf-playbook.md) | Bundle Size Tracking + Perf Playbook (**done**) | Packaging / Trust | 0.5–1 day |
| [C21](./C21-deep-profiling.md) | Deep Profiling (**deferred** — [scrutiny](./C21-profiling-scrutiny.md); evidence-gated) | Performance / Quality | 2–4 days if unlocked |
| [C22](./C22-mobile-playback-polish.md) | Mobile Playback Polish (**pending**) | Interaction / Polish | 1–2 days |
| [C23](./C23-chart-controls-panel.md) | Chart Controls Panel — library-owned display UI (**complete**) | Interaction / Integration | 3–5 days |
| [C24](./C24-agent-visual-qa.md) | Agent Visual QA Loop — browse, click, rubric, demo state (**in progress** — C24.1–C24.3 done) | Quality / Agent Tooling | 2–4 days |
| [C10](./C10-host-integration.md) | Host Application Feature-Flag Integration (dogfood; **not** publish-critical merge) | Integration | 1–2 days |

**Total estimated: ~20–25 days** (or ~4–5 weeks at 1/3 time)

---

## Implementation Order

Follow this sequence. Do not begin C1 until Pre-Start is complete.

1. PRE-C1-A — Label Collision Spike (**complete: Spatial Bin** — [decision](./PRE-C1-A-label-collision-spike.md#label-collision-algorithm-decision-completed))
2. PRE-C1-B — Outlier Strategy Decision (**complete: Fit-All** — [decision](./PRE-C1-B-outlier-strategy.md#decision-record-completed))
3. PRE-C1-C — Colorblind Accessibility Requirement (**complete** — [decision](./PRE-C1-C-accessibility-requirements.md#decisions-completed))
4. C1 — Component Project Skeleton
5. C2 — Public Data Contract and Types
6. C3 — Static SVG Axes and Quadrants
7. C4 — Points and Current Frame Rendering
8. C5 — Tail Rendering (+ performance smoke test)
9. C8 — Viewport Modes
10. C6 — Label Collision System
11. C7 — Hover, Tooltip, and Selection Events (**complete**)
12. C12 — Playback Controls (controlled timeline UI; independent of C6; can parallelize with C7) (**complete**)
13. C9 — Accessibility and Agent-Testability (**complete**)
14. C11 — Adversarial Review and Polish (**complete**)
15. C13 — Demo Playground (configurable scenarios, viewport UI, copy-as-code) (**complete**)
15b. C13.5 — Demo Session Persistence (**complete**)
16. C14 — Public Release Hygiene (packaging, CI, trust; optional scenarios export) (**complete**)
17. C15 — Tail Hit-Target Hover (investigate + implement after C14) (**complete**)
18. C16 — Render / Playback Optimization (long histories, redraw avoidance) (**complete**)
19. C17 — Performance Testing & Profiling (harness + use-case matrix) (**complete** — [scrutiny](./C17-research.md), [results](./C17-results.md))
20. C18 — Pre-npm Polish (review artifacts, API cleanup, README) (**complete** — [plan](./C18-pre-npm-polish.md))
21. C19.5 — Demo UX Simple/Customize (**complete** — [plan](./C19.5-demo-ux-simplify.md))
22. C19 — First public publish (**draft** — [plan](./C19-first-public-publish.md), [scrutiny](./C19-public-library-scrutiny.md)): rotation pitch, changelog accuracy, real-data dogfood gate, npm
23. C20 — Bundle size + perf playbook (**complete** — [plan](./C20-bundle-size-perf-playbook.md))
24. C21 — Deep profiling (**deferred** — [plan](./C21-deep-profiling.md), [scrutiny](./C21-profiling-scrutiny.md); only after evidence gate / host dogfood need)
25. C22 — Mobile playback polish (`RrgPlaybackControls` touch/layout; Sector Orbit should adopt library scrubber) (**pending** — [plan](./C22-mobile-playback-polish.md))
26. C23 — Chart controls panel: **all display toggles** (visibility, tail, viewport, labels, loop, export) owned by library; hosts wire data only (**complete** — [plan](./C23-chart-controls-panel.md))
27. C24 — Agent visual QA loop: interactive browse/click missions, demo `?agent=1` state, in-repo skill (replaces ad-hoc visual-ui-polish for library work); feeds C22/C23 UX (**pending** — [plan](./C24-agent-visual-qa.md))
28. C10 — Host feature-flag integration (**optional dogfood / recipe**; merge to host default branch not required for publish)

---

## Gating Decisions

| Gate | Trigger | Decision |
|------|---------|----------|
| Pre-Start complete | After PRE-C1-A, B, C | **A/B/C done.** Spatial Bin; Fit-All; colorblind props + core requirement. Proceed to C1. |
| Performance baseline | After C5 | If 50 tickers × 30 points fails ≥ 55 fps, scope v1 to 30 tickers and document ceiling. |
| Label proof | After C6 | If algorithm doesn't hold on real data, iterate before proceeding to C7. |
| Integration ready | After C11 | Standalone chart ready. C13/C14 for public demo; **C19** for first npm (includes real-data dogfood). Host `master` merge (C10) optional. |

---

## Definition of Done

The component is ready to integrate into a host application when:

- [x] Renders plain, readable RRG-style chart from mock data
- [x] Clear axes, quadrant labels, 100/100 center lines
- [x] Tails are readable with clear directionality
- [x] Labels do not fuse in clustered cases
- [x] Hover makes individual tickers easy to inspect
- [x] Playback controls (when used) make play state, speed, and position unambiguous ([C12](./C12-playback-controls.md))
- [x] Viewport modes (fit/max/center) are predictable and stable
- [x] Component API accepts generic `RrgRenderSeries[]` — no host-app assumptions
- [x] No calculation logic inside the component
- [x] Playwright can inspect chart elements via `data-testid`
- [x] Adversarial review passes (see C11)
- [ ] Host application can switch renderers via feature flag
- [x] Colorblind accessibility verified (Protanopia + Deuteranopia)
- [x] Performance: 50 tickers × 30 points at ≥ 55 fps

---

## Directory Structure (Target)

```
vue-relative-rotation-chart/
  plans/                        ← this directory
  src/
    components/
      RrgChart.vue              ← public wrapper, accepts props, emits events
      RrgSvgRoot.vue
      RrgAxes.vue
      RrgQuadrants.vue
      RrgTails.vue
      RrgPoints.vue
      RrgLabels.vue
      RrgTooltip.vue
      RrgPlaybackControls.vue   ← C12; composed beside chart by parent
    composables/
      useRrgScales.ts           ← D3 scale helpers (data → SVG pixels)
      useRrgViewport.ts         ← x/y domain for fit/max/center
      useRrgTailSlices.ts       ← derives tail data from series + selected date
      useRrgLabelLayout.ts      ← label placement & collision mitigation
      useRrgHoverState.ts       ← hover/selection state
      useRrgPlayback.ts         ← optional C12 frame/rAF helpers
    types/
      rrg.ts                    ← all exported public types
    utils/
      path.ts
      bounds.ts
      ticks.ts
      labels.ts
    demo/
      mockSeries.ts             ← mock data for all demo scenarios
  demo/                         ← Vite demo app
  tests/
```

---

## CSS Variable Theming

The component uses CSS variables for all colors — never hardcoded values:

```css
--rrg-bg
--rrg-grid
--rrg-axis
--rrg-center-line
--rrg-label
--rrg-muted-label
--rrg-point-stroke
--rrg-tooltip-bg
```

Default: plain light/reporting style. Dark mode override: set CSS vars from parent.
