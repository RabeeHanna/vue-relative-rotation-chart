# vue-relative-rotation-chart

[![CI](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml/badge.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-relative-rotation-chart.svg)](https://www.npmjs.com/package/vue-relative-rotation-chart)
[![license](https://img.shields.io/github/license/RabeeHanna/vue-relative-rotation-chart.svg)](./LICENSE)

**Vue 3 SVG library for RRG-style relative rotation charts** — render precomputed RS-Ratio × RS-Momentum series with readable tails, collision-aware labels, viewport modes, hover/tooltip, and optional playback scrubbing.

**Renderer only.** This package does not fetch prices, compute RS-Ratio / RS-Momentum, cache data, or own app routing/stores. Callers pass precomputed `RrgRenderSeries[]`.

> **Try it live:** [GitHub Pages demo](https://rabeehanna.github.io/vue-relative-rotation-chart/) · [npm package](https://www.npmjs.com/package/vue-relative-rotation-chart) · or locally with `npm run dev`

## Install

```bash
npm install vue-relative-rotation-chart
```

Also import styles once in your app:

```ts
import 'vue-relative-rotation-chart/style.css'
```

Peer dependency: Vue `^3.5.0`.

Workspace / local link:

```json
{
  "dependencies": {
    "vue-relative-rotation-chart": "file:../vue-relative-rotation-chart"
  }
}
```

## Quadrants

The `quadrant` field on each point **currently accepts these four values:** `leading`, `weakening`, `lagging`, and `improving`. A fully generic labeling scheme is deferred to a future major version — do not treat quadrant as an open-ended caller-defined string today.

## Usage

```vue
<script setup lang="ts">
import { RrgChart, RrgPlaybackControls } from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'
import 'vue-relative-rotation-chart/style.css'
import { ref } from 'vue'

const series: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    points: [
      { date: '2024-01-05', x: 102, y: 101, quadrant: 'leading' },
      { date: '2024-01-12', x: 103.5, y: 100.5, quadrant: 'leading' },
      { date: '2024-01-19', x: 104, y: 99.5, quadrant: 'weakening' },
    ],
  },
]

const selectedDate = ref('2024-01-19')
const dates = series[0].points.map((p) => p.date)
const playing = ref(false)
const speed = ref(2)
</script>

<template>
  <RrgChart
    :series="series"
    :selected-date="selectedDate"
    :tail-length="10"
    viewport-mode="fit"
    label-mode="auto"
  />
  <RrgPlaybackControls
    :dates="dates"
    v-model:selected-date="selectedDate"
    v-model:playing="playing"
    v-model:speed="speed"
    :loop="true"
  />
</template>
```

`selectedDate` should match a series point date. Mismatches **snap** to the nearest date (`data-date-status="snapped"`). Empty series → empty-state UI (`data-date-status="empty"`).

### Chart props

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `series` | `RrgRenderSeries[]` | — | Precomputed trails (required) |
| `selectedDate` | `string` | — | ISO date; snapped if missing |
| `tailLength` | `number` | `10` | Historical points in tail |
| `viewportMode` | `'fit' \| 'max' \| 'center'` | `'fit'` | Fit-All / max / fixed center |
| `labelMode` | `'auto' \| 'always' \| 'hover'` | `'auto'` | Collision-aware labels |
| `showQuadrantLabels` | `boolean` | `true` | |
| `showGrid` / `showAxes` | `boolean` | `true` | |
| `tickerLabelAlwaysVisible` | `boolean` | `false` | Colorblind / monochrome identity |
| `showTailFade` | `boolean` | `false` | Opacity gradient on tails |
| `highlightedTicker` / `selectedTicker` | `string \| null` | `null` | |
| `width` / `height` | `number` | `640` / `480` | |
| `pointRadius` / `hitRadius` | `number` | `5.5` / `12` | |
| `copy` | `RrgChartCopy` | — | Optional UI string overrides |

### Chart events

| Event | Payload |
|-------|---------|
| `pointHover` | `RrgRenderPoint` |
| `pointLeave` | — |
| `pointClick` | `RrgRenderPoint` |

### Playback props (optional)

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `dates` | `string[]` | — | Ascending ISO dates |
| `selectedDate` | `string` | — | Snapped to `dates`; `v-model:selected-date` |
| `playing` | `boolean` | `false` | `v-model:playing` |
| `speed` | `number` | `2` | `v-model:speed` |
| `loop` | `boolean` | `true` | `v-model:loop` |
| `layout` | `'auto' \| 'stacked' \| 'inline'` | `'auto'` | Responsive row vs stacked (mobile-friendly) |
| `labelStyle` | `'icon' \| 'icon-text'` | `'icon'` | Visible copy beside glyphs |
| `copy` | `RrgPlaybackCopy` | — | Optional label overrides |

### Chart controls (optional)

Compose beside `<RrgChart />` so hosts do not reimplement display toggles:

| Component | Purpose |
|-----------|---------|
| `RrgViewportControls` | Fit / Max / Center viewport mode |
| `RrgSeriesVisibilityControls` | Show, hide, solo, restore tickers |
| `RrgDisplaySettingsControls` | Tail length, label mode, tail fade |
| `RrgChartControlsPanel` | Collapsible shell composing the above (`sections` prop to hide blocks) |

`RrgChart` ref: `getSvgElement()` and `exportPng()` for PNG snapshot export. Helpers: `exportSvgElementAsPng`, `serializeSvgElement`, `useRrgSeriesVisibility` utilities.

### Scenario fixtures (optional)

```ts
import { denseCluster } from 'vue-relative-rotation-chart/scenarios'
// or: import { scenarioFixtures } from 'vue-relative-rotation-chart/scenarios'
```

Use `defaultScenario` for the sector baseline (`default` is a reserved word).

## Fragile surfaces (`0.x`)

Pre-1.0 may change between minors. Treat these as the surfaces most likely to move — pin carefully or read the changelog on upgrade:

1. **`RrgQuadrant`** — fixed four-value enum (`leading` \| `weakening` \| `lagging` \| `improving`) only  
2. **Playback `v-model` / emit names** — `selectedDate`, `playing`, `speed`, `loop`, `layout` (and related props)  
3. **Controls panel v-models** — `visibleTickers`, `viewportMode`, `tailLength`, `labelMode`, `showTailFade`, `sections` on panel subcomponents  
4. **`copy` shapes** — `RrgChartCopy` / `RrgPlaybackCopy` field keys and defaults  
5. **Visual defaults** — especially `showTailFade` (default `false`), `labelMode` (default `auto`), `pointRadius` / `hitRadius`

See also [Semver policy](#semver-policy).

## Performance

In its **supported configuration** (capped `tailLength` — the mode virtually every real use case needs), this package renders everyday and long-history boards at **55+ fps** continuously for both scrub and play on Chromium (Playwright harness).

We also stress-tested **well past that** — up to **100 tickers × 500 points with full-history tails (~100k SVG lines)** — to document exactly where it degrades. Continuous scrub there falls to single-digit fps; that ceiling is intentional documentation, not a supported product mode.

| Mode | Load | Scrub | Play | Role |
|------|------|-------|------|------|
| Product (P0) | default board, tail 10 | ~60 fps | ~60 fps | supported |
| Product (P2) | 8×200, tail 10 | ~60 fps | ~60 fps | supported |
| Ceiling | 100×500 full history | ~5 fps | display ~60 between ticks | document-only break |

Raw run log (machine, SHA, commands, caveats): [`docs/perf-results.md#2026-07-25--product--stress-ceiling-local-windows`](./docs/perf-results.md#2026-07-25--product--stress-ceiling-local-windows). Re-run locally with `npm run test:perf` and `PERF_STRESS=1 npm run test:perf -- --grep stress-ceiling`.

## Host integration (sketch)

Typical consumer pattern: keep calculation in the host; adapt host series → `RrgRenderSeries[]`; mount `RrgChart` (+ optional `RrgPlaybackControls`). A feature-flag swap next to an existing chart is enough for dogfood — see [`plans/C10-host-integration.md`](./plans/C10-host-integration.md).

```ts
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'

// hostAdapter.ts — map your calculated frames into RrgRenderSeries[]
export function toRrgSeries(hostSeries: YourSeries[]): RrgRenderSeries[] {
  return hostSeries.map((s) => ({
    ticker: s.symbol,
    label: s.symbol,
    name: s.name,
    points: s.frames.map((f) => ({
      date: f.isoDate,
      x: f.rsRatio,
      y: f.rsMomentum,
      quadrant: f.quadrant, // leading | weakening | lagging | improving
    })),
    color: s.color,
    visible: s.visible,
  }))
}
```

## Semver policy

- **Pre-1.0 (`0.x`):** public API may change between minors. Prefer the [fragile surfaces](#fragile-surfaces-0x) list over a vague “API may change” disclaimer when assessing upgrade risk.
- **v1+:** semver for the renderer API; the package remains renderer-only (no fetch/calc).
- See [`CHANGELOG.md`](./CHANGELOG.md). Prefer conventional commits (`feat:`, `fix:`, `docs:`, …).

## Scripts

```bash
npm install
npm run dev              # demo at http://localhost:5173
npm run build            # library build → dist/
npm run build:demo       # static demo → demo-dist/ (GitHub Pages)
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run test:perf        # Playwright FPS harness (C17)
npm run check:bundle-size
npm run review:artifacts # screenshots + debug JSON (plans/screenshots/)
```

Performance playbook: [`docs/perf.md`](./docs/perf.md). Agent browse/click QA: [`docs/agent-visual-qa.md`](./docs/agent-visual-qa.md) (`?agent=1` on the demo).

## Docs

v1 ships with this README + the Vite playground (no separate VitePress/Histoire site yet).

See [`plans/00-overview.md`](./plans/00-overview.md) for units of work.

Agent orientation: [`AGENTS.md`](./AGENTS.md). Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md). Security: [`SECURITY.md`](./SECURITY.md).
