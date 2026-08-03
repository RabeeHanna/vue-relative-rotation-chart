# vue-relative-rotation-chart

[![CI](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml/badge.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-relative-rotation-chart.svg)](https://www.npmjs.com/package/vue-relative-rotation-chart)
[![license](https://img.shields.io/github/license/RabeeHanna/vue-relative-rotation-chart.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/LICENSE)

Build interactive stock, ETF, sector, index, and portfolio-holdings rotation charts in Vue 3.

`vue-relative-rotation-chart` is an SVG component for [Relative Rotation Graph](https://www.relativerotationgraphs.com/what-is-a-relative-rotation-graph/) (RRG)-style visualizations. Plot precomputed [relative strength](https://www.investopedia.com/terms/r/relativestrength.asp) and [momentum](https://www.investopedia.com/terms/m/momentum.asp) values against a benchmark, display securities in Leading, Weakening, Lagging, and Improving quadrants, and animate historical movement with trails and timeline playback.

> **Live demo:** [GitHub Pages](https://rabeehanna.github.io/vue-relative-rotation-chart/) · [npm](https://www.npmjs.com/package/vue-relative-rotation-chart) · local: `npm run dev`

![vue-relative-rotation-chart demo — sector ETF RRG with controls and playback](https://github.com/RabeeHanna/vue-relative-rotation-chart/raw/develop/public/readme-demo.png)

## What it renders (and what it does not)

**Renders:** precomputed RS-Ratio (`x`) and RS-Momentum (`y`) trails per ticker, quadrant labels, tails, labels, viewport modes, optional controls panel, playback scrubber, PNG/SVG export, and theming via CSS variables.

**Does not:** fetch prices, calculate RS-Ratio or RS-Momentum, cache data, or emit trading signals. Your application computes scores and passes `RrgRenderSeries[]` with ISO `date`, `x`, `y`, and `quadrant` per point.

## Install and minimal example

```bash
npm install vue-relative-rotation-chart
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  RrgChart,
  RrgPlaybackControls,
  collectSeriesDates,
} from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'
import 'vue-relative-rotation-chart/style.css'

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
const dates = collectSeriesDates(series)
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

Peer dependency: Vue `^3.5.0`. Subpath `vue-relative-rotation-chart/scenarios` is **ESM-only** (`import`).

Use `collectSeriesDates(series)` for the playback timeline — do not assume every ticker shares the same dates. Tickers without a point on the resolved `selectedDate` are hidden for that frame (no interpolation).

## Chart + controls integration

Bind `v-model:visible-tickers` on both `RrgChart` and `RrgChartControlsPanel` so show/hide/solo updates the chart:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  RrgChart,
  RrgChartControlsPanel,
  RrgPlaybackControls,
  collectSeriesDates,
  seriesTickers,
} from 'vue-relative-rotation-chart'
import type { RrgRenderSeries, RrgLabelMode, RrgViewportMode } from 'vue-relative-rotation-chart'
import 'vue-relative-rotation-chart/style.css'

const series: RrgRenderSeries[] = [/* … */]
const visibleTickers = ref(seriesTickers(series))
const selectedDate = ref(series[0]?.points.at(-1)?.date ?? '')
const dates = collectSeriesDates(series)
const viewportMode = ref<RrgViewportMode>('fit')
const tailLength = ref(10)
const labelMode = ref<RrgLabelMode>('auto')
const showTailFade = ref(false)
const playing = ref(false)
const speed = ref(2)
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
    :viewport-mode="viewportMode"
    :tail-length="tailLength"
    :label-mode="labelMode"
    :show-tail-fade="showTailFade"
  />
  <RrgPlaybackControls
    :dates="dates"
    v-model:selected-date="selectedDate"
    v-model:playing="playing"
    v-model:speed="speed"
  />
</template>
```

`selectedDate` snaps to the nearest series date when missing (`data-date-status="snapped"`). Empty series shows empty-state UI.

## Data invariants

| Expectation | Behavior |
|-------------|----------|
| Sorted dates per series | Required — unsorted input is undefined |
| Sparse / heterogeneous dates | Use `collectSeriesDates`; missing tickers hide per frame |
| Replace `series` reference | Required when point data changes (no in-place mutation) |
| `quadrant` enum | `leading` · `weakening` · `lagging` · `improving` |

Adapter pattern for host data:

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

See `RrgChartProps` JSDoc in the published types for the full contract.

## Theming, accessibility, and SSR

**Theming** — override `--rrg-*` CSS variables on the chart root (quadrant fills, grid, labels, point colors). Control chrome uses `--rrg-ctl-*` tokens. Optional `copy` / `controlsCopy` props localize strings; `formatters` customize numbers.

**Accessibility** — SVG title/description, keyboard-activatable points, playback live region. Prefer `tickerLabelAlwaysVisible` for colorblind / monochrome identity.

**SSR** — static chart markup can render on the server. Playback (`requestAnimationFrame`) and `ResizeObserver` require a browser; guard `playing: true` until client mount if you SSR playback controls.

## Export and performance

**Export** — `exportPng()` and `getSvgElement()` on the chart ref. PNG rasterizes computed styles; complex themes may need verification.

**Performance** — capped `tailLength` (default product mode) targets **55+ fps** for scrub and play on Chromium in our harness. Full-history stress (100 tickers × 500 points) is documented for ceiling testing only, not a supported product configuration.

## Chart props (summary)

| Prop | Type | Default | Notes |
|------|------|---------|--------|
| `series` | `RrgRenderSeries[]` | — | Precomputed trails (required) |
| `selectedDate` | `string` | — | ISO date; snapped if missing |
| `visibleTickers` | `string[]` | — | Optional `v-model` |
| `tailLength` | `number` | `10` | Historical points in tail |
| `viewportMode` | `'fit' \| 'max' \| 'center'` | `'fit'` | Fit-All default |
| `labelMode` | `'auto' \| 'always' \| 'hover'` | `'auto'` | Spatial-bin collision |
| `tickerLabelAlwaysVisible` | `boolean` | `false` | Identity override |
| `showTailFade` | `boolean` | `false` | Tail opacity gradient |
| `copy` / `formatters` | objects | — | Localization hooks |

Optional components: `RrgViewportControls`, `RrgSeriesVisibilityControls`, `RrgDisplaySettingsControls`, `RrgChartControlsPanel`, `RrgPlaybackControls`.

Fixtures: `import { scenarioFixtures } from 'vue-relative-rotation-chart/scenarios'`.

## Non-goals

- Market data fetching or indicator calculation
- React / vanilla JS builds
- Trading signals or financial advice
- Official JdK RRG formula parity (independent RRG-style renderer)

## FAQ

**What is an RRG?** A scatter chart of RS-Ratio vs RS-Momentum used to track rotation through four phases relative to a benchmark.

**Does this calculate scores?** No — presentation only. Compute in your backend or app, then pass precomputed points.

**Can I use this for sector rotation dashboards?** Yes — one series per sector or ticker. See the [live demo](https://rabeehanna.github.io/vue-relative-rotation-chart/).

## Trademark note

Relative Rotation Graph and RRG are trademarks of their respective owners. This component is developed independently and is not endorsed by RRG Research.

## Semver (`0.x`)

Pre-1.0 may change between minors. Fragile surfaces: `RrgQuadrant` enum, playback `v-model` names, controls panel v-models, `copy` shapes, visual defaults. See [CHANGELOG](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CHANGELOG.md).

## Links

- [Live demo](https://rabeehanna.github.io/vue-relative-rotation-chart/)
- [CONTRIBUTING](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CONTRIBUTING.md)
- [SECURITY](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/SECURITY.md)
- [CHANGELOG](https://github.com/RabeeHanna/vue-relative-rotation-chart/blob/develop/CHANGELOG.md)

```bash
npm install && npm run dev    # demo at http://localhost:5173
npm test && npm run build     # library → dist/
```
