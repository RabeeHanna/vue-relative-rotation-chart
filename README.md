# vue-relative-rotation-chart

A Vue SVG component for rendering RRG-style relative rotation charts from precomputed relative strength and momentum data.

**This component is a renderer only** — it does not fetch data or perform RRG calculations. All RS-Ratio / RS-Momentum values must be pre-calculated and passed as series props.

## Install

Workspace / local link (Sector Orbit for now):

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

## Scripts

```bash
npm install
npm run dev          # demo at http://localhost:5173
npm run build        # library build → dist/
npm run typecheck
npm run lint
npm test
npm run spike:labels # PRE-C1-A spike
```

See [`plans/00-overview.md`](./plans/00-overview.md) for units of work.
