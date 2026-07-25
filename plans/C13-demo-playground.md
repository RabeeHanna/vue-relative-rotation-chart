# C13: Demo Playground

**Phase:** Demo / Polish  
**Estimate:** 2–3 days (implementation after this plan)  
**Depends on:** C11 complete (scenarios exist); C9 (a11y summary available to preview)  
**Related:** [C14 Public Release](./C14-public-release.md) follows; [C15 Tail Hover](./C15-tail-hover.md) after C14  
**Priority:** Standard — makes the package demoable and adoptable without Sector Orbit  
**Status:** Complete (implementation + unit tests; long-playback + Tier 4 follow-up)

---

## Goal

Turn the Vite demo into an exhaustive, configurable playground: richer scenarios, interactive viewport/label/theme controls, copy-as-code for adoption, accessible-summary preview, and Advanced tools (BYO JSON, seeded generator, side-by-side viewport compare, embed-width preview).

---

## Current State

[`demo/DemoApp.vue`](../demo/DemoApp.vue) today:

- Scenario `<select>` over [`demo/adversarialMocks.ts`](../demo/adversarialMocks.ts)
- `RrgPlaybackControls`
- Meta dump of label/viewport/date/hover

Most chart knobs are URL-only or missing from the UI. There is no copy-as-code, BYO data, a11y preview, compare mode, or embed-width control.

---

## Locked Decisions

### 1. Side-by-side viewport compare

Left and right viewport modes are **independently pickable** among `fit` | `max` | `center`. Defaults on first open: **Fit | Center**.

Shared across both charts: series, `selectedDate`, `tailLength`, `labelMode`, theme, chrome toggles.

### 2. Copy-as-code is two separate concerns

**Hard rule:** Never truncate series JSON. Never use `// ...` elision. Never inline a series array in the primary snippet — truncated or “almost pasteable” snippets defeat adoption.

#### Primary artifact — component usage snippet (always shown)

Always references `series` as a variable. One shape for every data source:

```vue
<RrgChart
  :series="series"
  :selected-date="selectedDate"
  viewport-mode="fit"
  label-mode="auto"
  :tail-length="8"
/>
```

- Short, always syntactically valid
- Demonstrates the public API surface
- Even tiny presets are **not** inlined (consistency)
- May include companion lines for playback binding when relevant

#### Secondary artifact — data (conditional)

| Active source | Data action |
|---------------|-------------|
| Built-in preset | Comment (C13) naming the fixture; prefer real import once C14 ships `vue-relative-rotation-chart/scenarios` — e.g. `import { denseCluster } from 'vue-relative-rotation-chart/scenarios'` |
| Custom pasted JSON | **No data copy** — user already has it |
| Generated / random | Separate **Copy data JSON** control (secondary), labeled with size hint (e.g. `50 tickers × 30 points — ~6 KB`); copies **full** JSON |

---

## Ranked Configurable Parameters

### Tier 1 — first-class UI controls

1. Scenario / dataset  
2. Viewport mode (`fit` \| `max` \| `center`)  
3. Label mode (`auto` \| `always` \| `hover`)  
4. Tail length  
5. Theme (light / dark via `.rrg-chart.dark` / `.rrg-playback.dark` only — demo shell stays light)

### Tier 2 — polish / adoption / a11y

6. Copy-as-code (primary props snippet — locked model above)  
7. Accessible summary preview (live SVG `<title>` / `<desc>` text)  
8. ~~`showPatterns`~~ (**deprecated** — removed from demo; prefer Always labels)  
9. `tickerLabelAlwaysVisible`  
10. Playback speed / loop / play (existing `RrgPlaybackControls`)  
11. Selected date / frame (scrubber)  
12. Chart size presets (compact / default / wide)

### Tier 3 — Advanced disclosure

13. BYO JSON textarea (`RrgRenderSeries[]` placeholder; Apply → `custom` source; inline parse errors)  
14. Seeded generator (ticker count, points-per-ticker, seed) + **Copy data JSON**  
15. Side-by-side viewport compare (pickable L/R modes)  
16. Responsive / embed preview (presets 320 / 480 / 720 or resizable frame)  
17. `showQuadrantLabels` / `showGrid` / `showAxes`  
18. `highlightedTicker` (table-row sync simulation)  
19. Hover readout chip (replace raw meta dump)

### Tier 4 — power-user (shipped in C13 follow-up)

20. CSS variable editors (demo-local theme vars on chart host)  
21. Point / hit radius (optional public props on `RrgChart`)  
22. Playback `minSpeed` / `maxSpeed`  
23. `selectedTicker` (minimal distinct ring styling + demo field)  
24. Long-playback stress scenarios: 50 / 100 / 200 / 500 points per ticker

---

## UI Wireframe

```
[ Scenario | Viewport | Labels | Tail | Theme ]
[ Playback controls ]
[ Copy component snippet ] [ Accessible summary ▸ ]
[ Advanced ▸  BYO JSON | Generate N (+ Copy data JSON) | Compare (L/R modes) | Embed width | Chrome ]
[ Chart host — single or dual when Compare on ]
```

Keep SFCs ≤ 200 lines: extract `DemoControls.vue` (and helpers) from `DemoApp.vue`.

---

## Scenario Catalog

| ID | Display name | Intent | Suggested viewport | Suggested labelMode |
|----|--------------|--------|--------------------|---------------------|
| `default` | Sector baseline | Everyday multi-ticker view | `fit` | `auto` |
| `denseCluster` | Dense cluster | Label collision under auto | `fit` | `auto` |
| `farRightOutlier` | Far-right outlier | Fit-All vs center/max | `fit` then compare `center` | `auto` |
| `farLeftOutlier` | Far-left outlier | Same, opposite side | `fit` | `auto` |
| `manyOverlapping` | Coincident pairs | Stacked hit targets | `fit` | `always` |
| `noisyTail` | Noisy tails | Direction readability | `fit` | `auto` |
| `singleTicker` | Single ticker | Degenerate / sparse UI | `fit` | `auto` |
| `stress` | Stress 50×30 | Fixed density / perf story | `fit` | `hover` |
| `missingLabel` | Missing labels | Tooltip still shows ticker | `fit` | `auto` |
| `longLabel` | Long labels | Collision + width | `fit` | `auto` |
| `quadrantTour` | Quadrant tour (**new**) | One ticker per quadrant | `fit` | `always` |
| `rotationCycle` | Rotation cycle (**new**) | Classic clockwise RRG path | `fit` | `auto` |
| `emptyOrSparse` | Empty / sparse (**new**) | Graceful empty & single-date | `fit` | `auto` |
| `mixedVisibility` | Mixed visibility (**new**) | Some `visible: false` | `fit` | `auto` |

**Dynamic sources** (override active series; presets remain selectable):

- `custom` — BYO JSON applied  
- `generated` — seeded random walk applied  

Each preset documents a one-line acceptance check in implementation notes / demo help text.

---

## URL Sync

Persist Tier 1 + relevant Tier 2 / compare state:

`scenario`, `viewportMode`, `labelMode`, `theme`, `tailLength`, `showPatterns` (compat only; deprecated), `tickerLabelAlwaysVisible`, `size`, `compare`, `viewportLeft`, `viewportRight`, `source=preset|custom|generated`

- Custom / generated **data bodies are not** encoded in the URL  
- When `source` is `custom` or `generated`, show: “Data not in link — re-paste or re-generate”  
- Primary snippet always uses `:series="series"` (unaffected by URL size)

---

## Files to Add / Change (implementation)

```
demo/
  DemoApp.vue              ← thin shell
  DemoControls.vue         ← Tier 1–3 controls
  scenarios.ts             ← rename/split from adversarialMocks; registry + metadata
  copySnippet.ts           ← build primary Vue snippet string
  generateSeries.ts        ← seeded random-walk RrgRenderSeries[]
  parseSeriesJson.ts       ← validate BYO JSON
tests/
  demo.copySnippet.test.ts
  demo.generateSeries.test.ts
  demo.parseSeriesJson.test.ts
  e2e/demo-playground.spec.ts   ← control + snippet smoke (optional same unit)
```

Production `src/` unchanged except if C14 later adds `scenarios` export (not required to finish C13 demo).

---

## Unit Tests (required at implementation)

- Scenario registry: every catalog ID resolves; metadata present  
- Query round-trip for Tier 1 knobs  
- `copySnippet` always includes `:series="series"` and **never** a series array literal  
- Preset mode: snippet includes fixture name comment or future import line  
- Generator: same seed → identical series; Copy data JSON equals full `JSON.stringify`  
- BYO: valid JSON applies; invalid shows error and does not replace series  
- Compare: left/right modes independent; shared date updates both  

---

## Out of Scope

- [C10](./C10-sector-orbit-integration.md) Sector Orbit wiring  
- RRG calculation / fetching  
- Truncating or inlining series in the primary snippet  
- Full docs site / Histoire / npm publish ([C14](./C14-public-release.md))  
- Tier 4 power-user editors  

---

## Acceptance Criteria

### Plan / docs (this unit)

- [x] Ranked parameter list and locked copy/compare decisions recorded  
- [x] Scenario catalog with intents and suggested viewport/label  
- [x] UI wireframe and file list  
- [x] Linked from [00-overview](./00-overview.md); C14 stub referenced  

### Implementation (follow-on coding unit)

- [x] Tier 1 controls visible and wired (including viewport)  
- [x] Copy component snippet matches locked model  
- [x] Accessible summary preview updates with chart state  
- [x] Advanced: BYO, generator + Copy data JSON, pickable compare, embed width  
- [x] New scenarios: `quadrantTour`, `rotationCycle`, `emptyOrSparse`, `mixedVisibility`  
- [x] URL sync + “data not in link” for custom/generated  
- [x] Unit tests green; SFCs within size limits  
- [x] `npm run typecheck` passes  

---

## Cross-refs

- Viewport behavior: [C8](./C8-viewport.md), [PRE-C1-B](./PRE-C1-B-outlier-strategy.md)  
- Labels: [C6](./C6-label-collision.md)  
- A11y summary / patterns: [C9](./C9-accessibility.md)  
- Adversarial fixtures: [C11](./C11-adversarial-review.md)  
- Public packaging / scenarios subpath: [C14](./C14-public-release.md)  
