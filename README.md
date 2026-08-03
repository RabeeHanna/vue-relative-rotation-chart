# vue-relative-rotation-chart

[![CI](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml/badge.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-relative-rotation-chart.svg)](https://www.npmjs.com/package/vue-relative-rotation-chart)
[![license](https://img.shields.io/github/license/RabeeHanna/vue-relative-rotation-chart.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/LICENSE)

Build interactive stock, ETF, sector, index, and portfolio-holdings rotation charts in Vue 3.

`vue-relative-rotation-chart` is an SVG component for creating [Relative Rotation Graph](https://www.relativerotationgraphs.com/what-is-a-relative-rotation-graph/) (RRG)-style visualizations. Plot precomputed [relative strength](https://www.investopedia.com/terms/r/relativestrength.asp) and [momentum](https://www.investopedia.com/terms/m/momentum.asp) values against a benchmark, display securities in Leading, Weakening, Lagging, and Improving quadrants, and animate their historical movement with readable trails and timeline playback.

Use it to add market-rotation analysis to a stock dashboard, ETF screener, portfolio visualization, financial application, or technical-analysis tool.

This package is a **renderer**, not a market-data or indicator-calculation library. Your application supplies the precomputed RS-Ratio and RS-Momentum series; the component handles visualization, interaction, labels, controls, playback, and export.

> **Live demo:** [GitHub Pages](https://rabeehanna.github.io/vue-relative-rotation-chart/) · [npm](https://www.npmjs.com/package/vue-relative-rotation-chart) · local: `npm run dev`

![vue-relative-rotation-chart demo — sector ETF RRG with controls and playback](https://github.com/RabeeHanna/vue-relative-rotation-chart/raw/develop/public/readme-demo.png)

## What can I build?

- Add an RRG-style sector-rotation chart to a Vue stock dashboard.
- Compare stocks, ETFs, sectors, indices, or portfolio holdings against a benchmark such as SPY.
- Visualize which securities are gaining or losing relative momentum.
- Animate movement through Leading, Weakening, Lagging, and Improving quadrants.
- Show historical leadership changes within a watchlist or market universe.
- Render precomputed RRG-style values from a Python, FastAPI, Node, or financial-data backend.

The package visualizes supplied results. It does not fetch current prices, calculate RS-Ratio or RS-Momentum, score a portfolio, or generate trading signals.

## Agent capability contract

| Question | Answer |
|----------|--------|
| Framework | Vue 3 |
| Rendering | SVG |
| Input | Precomputed dated series for named securities |
| Fetches market prices | No |
| Calculates RS-Ratio or RS-Momentum | No |
| Supports stocks, ETFs, sectors, and indices | Yes, when supplied as series |
| Portfolio holdings | Yes, as a visualization use case |
| Quadrants | Leading, Weakening, Lagging, Improving |
| Historical tails | Yes |
| Playback controls | Yes |
| Image export | PNG |
| Trading signals or financial advice | No |

## Install

```bash
npm install vue-relative-rotation-chart
```

```ts
import 'vue-relative-rotation-chart/style.css'
```

Peer dependency: Vue `^3.5.0` (Vue 3.3 and 3.4 are not tested against this release).

Subpath `vue-relative-rotation-chart/scenarios` is **ESM-only** (`import`); there is no CommonJS `require` export for scenarios.

## Quick start

```vue
<script setup lang="ts">
import { RrgChart, RrgPlaybackControls } from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'
import 'vue-relative-rotation-chart/style.css'
import { ref } from 'vue'

const series: RrgRenderSeries[] = [{
  ticker: 'XLK',
  label: 'XLK',
  name: 'Technology',
  points: [
    { date: '2024-01-05', x: 102, y: 101, quadrant: 'leading' },
    { date: '2024-01-12', x: 103.5, y: 100.5, quadrant: 'leading' },
    { date: '2024-01-19', x: 104, y: 99.5, quadrant: 'weakening' },
  ],
}]

const selectedDate = ref('2024-01-19')
const dates = series[0].points.map((p) => p.date)
const playing = ref(false)
const speed = ref(2)
</script>

<template>
  <RrgChart :series="series" :selected-date="selectedDate" :tail-length="10" />
  <RrgPlaybackControls
    :dates="dates"
    v-model:selected-date="selectedDate"
    v-model:playing="playing"
    v-model:speed="speed"
  />
</template>
```

`selectedDate` snaps to the nearest point date when missing (`data-date-status="snapped"`). Empty series shows empty-state UI.

## Common implementation requests

- “Add a sector rotation chart to my Vue dashboard.”
- “Compare my stock watchlist against SPY using relative strength and momentum.”
- “Animate ETFs moving between Leading, Weakening, Lagging, and Improving.”
- “Render RRG-style data calculated by my Python backend.”
- “Visualize which portfolio holdings are gaining relative momentum.”

## Features

- **RRG quadrants** — `leading` · `weakening` · `lagging` · `improving` (fixed enum in `0.x`)
- **Tails** — configurable `tailLength`; optional tail fade
- **Labels** — spatial-bin collision avoidance (`auto` \| `always` \| `hover`)
- **Viewport** — `fit` \| `max` \| `center` (Fit-All default)
- **Playback** — scrubber + play/pause/speed controls (`RrgPlaybackControls`)
- **Controls panel** — viewport, series visibility (show/hide/solo), display settings
- **Export** — `exportPng()` / `getSvgElement()` on chart ref
- **Theming** — CSS variables + optional `copy` string overrides
- **Fixtures** — `vue-relative-rotation-chart/scenarios` for demos and tests

## Chart props

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `series` | `RrgRenderSeries[]` | — | Precomputed trails (required) |
| `selectedDate` | `string` | — | ISO date; snapped if missing |
| `visibleTickers` | `string[]` | — | Optional `v-model`; share with visibility controls |
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
| `copy` | `RrgChartCopy` | — | Quadrants, axes, tooltip, empty-state strings |
| `formatters` | `RrgChartFormatters` | — | `formatNumber` / `formatAxisTick` hooks |

### Events

| Event | Payload |
|-------|---------|
| `pointHover` | `RrgRenderPoint` |
| `pointLeave` | — |
| `pointClick` | `RrgRenderPoint` |

### Optional controls

| Component | Purpose |
|-----------|---------|
| `RrgViewportControls` | Fit / Max / Center |
| `RrgSeriesVisibilityControls` | Show, hide, solo, restore tickers |
| `RrgDisplaySettingsControls` | Tail length, label mode, tail fade |
| `RrgChartControlsPanel` | Collapsible shell (`sections` to hide blocks) |
| `RrgPlaybackControls` | Timeline scrub + play (`v-model` props) |

Bind `v-model:visible-tickers` on both `RrgChart` and `RrgChartControlsPanel` (or `RrgSeriesVisibilityControls`) so show/hide/solo updates the chart without calling `applyVisibleTickers` yourself:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  RrgChart,
  RrgChartControlsPanel,
  seriesTickers,
} from 'vue-relative-rotation-chart'
import type { RrgRenderSeries, RrgLabelMode, RrgViewportMode } from 'vue-relative-rotation-chart'

const series: RrgRenderSeries[] = [/* … */]
const visibleTickers = ref(seriesTickers(series))
const selectedDate = ref(series[0]?.points.at(-1)?.date ?? '')
const viewportMode = ref<RrgViewportMode>('fit')
const tailLength = ref(10)
const labelMode = ref<RrgLabelMode>('auto')
const showTailFade = ref(false)
</script>

<template>
  <RrgChartControlsPanel
    v-model:visible-tickers="visibleTickers"
    v-model:viewport-mode="viewportMode"
    v-model:tail-length="tailLength"
    v-model:label-mode="labelMode"
    v-model:show-tail-fade="showTailFade"
    :series="series"
  />
  <RrgChart
    :series="series"
    :selected-date="selectedDate"
    v-model:visible-tickers="visibleTickers"
  />
</template>
```

`applyVisibleTickers` remains available when you prefer to filter series before passing them in.

### Localization (`copy` + `controlsCopy`)

| Surface | Prop | Covers |
|---------|------|--------|
| Chart SVG | `copy` on `RrgChart` | Quadrants, axis titles, tooltip labels, a11y title/desc, empty states |
| Playback | `copy` on `RrgPlaybackControls` | Transport buttons, frame label, aria group |
| Control panel | `controlsCopy` on `RrgChartControlsPanel` | Section titles, viewport/display/visibility labels |
| Numbers | `formatters` on `RrgChart` | Axis ticks, tooltip values, point aria (`formatNumber`, `formatAxisTick`) |

Omitted keys fall back to English defaults via `mergeChartCopy`, `mergeControlsCopy`, and `mergePlaybackCopy`. Ticker symbols and ISO dates in tooltips are caller data, not translated by the package.

### Accessibility

- Chart SVG exposes `role="img"` with generated `<title>` / `<desc>` from the resolved date and visible tickers.
- Interactive points are focusable (`tabindex="0"`), activate on **Enter** and **Space**, and expose `aria-pressed` when `selectedTicker` matches.
- Place `<RrgChart>` before `<RrgPlaybackControls>` in the DOM so tab order moves through chart points, then the timeline scrubber and transport buttons.
- Link playback to the chart with matching ids: set `regionId` on `RrgChart` and `chartRegionId` on `RrgPlaybackControls` (the scrubber sets `aria-controls`). When `regionId` is omitted, the chart auto-generates one.
- The timeline scrubber `aria-valuetext` includes the ISO date and frame position (for example `2024-03-01 — Frame 2 of 5`).

## Host integration

Keep RRG calculation in the host; adapt frames → `RrgRenderSeries[]`:

```ts
export function toRrgSeries(hostSeries: YourSeries[]): RrgRenderSeries[] {
  return hostSeries.map((s) => ({
    ticker: s.symbol,
    label: s.symbol,
    name: s.name,
    points: s.frames.map((f) => ({
      date: f.isoDate,
      x: f.rsRatio,
      y: f.rsMomentum,
      quadrant: f.quadrant,
    })),
  }))
}
```

Try the [live demo](https://rabeehanna.github.io/vue-relative-rotation-chart/) to see the chart and controls in action.

## FAQ

**What is a Relative Rotation Graph (RRG)?**  
A scatter chart of RS-Ratio (horizontal) vs RS-Momentum (vertical) used in technical analysis to track how securities rotate through four phases relative to a benchmark — popular for sector and index rotation studies.

**Does this calculate RS-Ratio or RS-Momentum?**  
No. This is a **presentation-only** Vue chart library. Your app computes scores and passes precomputed `x`, `y`, and `quadrant` per point.

**Is there a React or vanilla JS version?**  
This package is Vue 3 only. The SVG output is standard DOM — you could port the rendering approach, but no sibling package exists yet.

**Can I use this for sector rotation dashboards?**  
Yes — pass one series per sector or ticker. Optional playback scrubbing helps animate rotation over time. See the [live demo](https://rabeehanna.github.io/vue-relative-rotation-chart/) for a working example.

## Trademark note

Relative Rotation Graph and RRG are trademarks of their respective owners. This component uses an RRG-style methodology, is developed independently, is not endorsed by RRG Research, and does not claim official JdK formula parity.

## Performance

Supported product mode (capped `tailLength`) sustains **55+ fps** for scrub and play on Chromium. Stress ceiling (100 tickers × 500 full-history points) is documented in-repo, not a supported product mode. Run `npm run test:perf` and `npm run check:bundle-size` after `npm run build` (see [CONTRIBUTING](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CONTRIBUTING.md)).

## Semver (`0.x`)

Pre-1.0 may change between minors. Fragile surfaces: `RrgQuadrant` enum, playback `v-model` names, controls panel v-models, `copy` shapes, visual defaults. See [CHANGELOG](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CHANGELOG.md).

## Scripts

```bash
npm install && npm run dev    # demo at http://localhost:5173
npm test && npm run build     # library → dist/
```

Contributing: [CONTRIBUTING.md](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CONTRIBUTING.md) · Agent orientation: [AGENTS.md](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/AGENTS.md)
