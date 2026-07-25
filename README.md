# vue-relative-rotation-chart

[![CI](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml/badge.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/RabeeHanna/vue-relative-rotation-chart.svg)](./LICENSE)

A Vue SVG component for rendering RRG-style relative rotation charts from precomputed relative strength and momentum data.

**This component is a renderer only** — it does not fetch prices, compute RS-Ratio / RS-Momentum, cache data, or own app routing/stores. Callers must pass precomputed `RrgRenderSeries[]`.

> **Not published to npm yet.** Prefer a git / `file:` / workspace link until the first deliberate publish.
>
> **Try it live:** [GitHub Pages demo](https://rabeehanna.github.io/vue-relative-rotation-chart/) · or locally with `npm run dev`

## Install

```bash
# After public release:
# npm install vue-relative-rotation-chart
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

## Usage

```vue
<script setup lang="ts">
import { RrgChart, RrgPlaybackControls } from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'
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
| `selectedDate` | `string` | — | Snapped to `dates` |
| `playing` / `speed` / `loop` | controlled | see defaults | `v-model:` supported |
| `labelStyle` | `'icon' \| 'icon-text'` | `'icon'` | Visible copy beside glyphs |
| `copy` | `RrgPlaybackCopy` | — | Optional label overrides |

### Scenario fixtures (optional)

```ts
import { denseCluster } from 'vue-relative-rotation-chart/scenarios'
// or: import { scenarioFixtures } from 'vue-relative-rotation-chart/scenarios'
```

Use `defaultScenario` for the sector baseline (`default` is a reserved word).

## Semver policy

- **Pre-1.0 (`0.x`):** public API may change between minors; treat upgrades carefully.
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
npm run review:artifacts # screenshots + debug JSON (plans/screenshots/)
```

## Docs

v1 ships with this README + the Vite playground (no separate VitePress/Histoire site yet).

See [`plans/00-overview.md`](./plans/00-overview.md) for units of work.

Agent orientation: [`AGENTS.md`](./AGENTS.md). Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md). Security: [`SECURITY.md`](./SECURITY.md).
