# vue-relative-rotation-chart

[![CI](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml/badge.svg)](https://github.com/RabeeHanna/vue-relative-rotation-chart/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/vue-relative-rotation-chart.svg)](https://www.npmjs.com/package/vue-relative-rotation-chart)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vue-relative-rotation-chart)](https://bundlephobia.com/package/vue-relative-rotation-chart)
[![license](https://img.shields.io/npm/l/vue-relative-rotation-chart.svg)](./LICENSE)

A Vue SVG component for rendering RRG-style relative rotation charts from precomputed relative strength and momentum data.

**This component is a renderer only** — it does not fetch data or perform RRG calculations. All RS-Ratio / RS-Momentum values must be pre-calculated and passed as series props.

> **Try it live:** [GitHub Pages demo](https://rabeehanna.github.io/vue-relative-rotation-chart/) · or locally with `npm run dev`

## Install

**npm publish is deferred** until a deliberate public release (workflow exists; not run yet). Until then, prefer a workspace / git / `file:` link:

```bash
# After public release:
# npm install vue-relative-rotation-chart
```

Peer dependency: Vue `^3.5.0`.

Workspace / local link (e.g. Sector Orbit):

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
import { RrgChart } from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'

const series: RrgRenderSeries[] = []
const selectedDate = '2024-03-01'
</script>

<template>
  <RrgChart
    :series="series"
    :selected-date="selectedDate"
    :tail-length="10"
    viewport-mode="fit"
  />
</template>
```

### Scenario fixtures (optional)

Named demo fixtures for docs and copy-as-code:

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
npm run dev          # demo at http://localhost:5173
npm run build        # library build → dist/
npm run build:demo   # static demo → demo-dist/ (GitHub Pages)
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

## Docs

v1 ships with this README + the Vite playground (no separate VitePress/Histoire site yet).

See [`plans/00-overview.md`](./plans/00-overview.md) for units of work.

Agent orientation: [`AGENTS.md`](./AGENTS.md). Contributing: [`CONTRIBUTING.md`](./CONTRIBUTING.md). Security: [`SECURITY.md`](./SECURITY.md).
