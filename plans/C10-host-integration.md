# C10: Host Application Feature-Flag Integration

**Phase:** Integration  
**Estimate:** 1–2 days  
**Depends on:** C11 complete (adversarial review passed); prefer after [C18](./C18-pre-npm-polish.md)  
**Priority:** Standard  
**Suggested schedule:** After C18

---

## Goal

Drop the custom SVG renderer into the **host application** behind a feature flag, without removing or breaking the existing chart implementation. Both renderers consume the same calculated data. No calculation code changes.

---

## Prerequisite

**Do not begin this unit until C11 (adversarial review) is complete and the integration decision is recorded.** Prefer completing [C18](./C18-pre-npm-polish.md) first so the public package surface is stable.

The component is integrated into the host app only after it has proven it can handle real-world RRG data in standalone testing.

---

## Scope

All work in this unit happens in the **host application** codebase, not in this package. This unit connects the two repositories.

### Step 1: Install the Package

Add `vue-relative-rotation-chart` to the host app's `package.json` as a local workspace link:

```json
{
  "dependencies": {
    "vue-relative-rotation-chart": "file:../vue-relative-rotation-chart"
  }
}
```

After `npm install`, verify that the package resolves and TypeScript can import from it:

```ts
import { RrgChart } from 'vue-relative-rotation-chart'
import type { RrgRenderSeries } from 'vue-relative-rotation-chart'
```

### Step 2: Create the Renderer Adapter

Create a new file in the host app: `src/adapters/rrgChartAdapter.ts`

This adapter converts the host app's internal state to the `RrgChartInput` type that the component expects.

```ts
import type { RrgRenderSeries, RrgChartInput } from 'vue-relative-rotation-chart'
import type { HostRrgState } from '../types' // host app internal type

export function adaptToRrgChart(state: HostRrgState): RrgChartInput {
  return {
    selectedDate: state.selectedDate,
    tailLength: state.tailLength,
    viewportMode: adaptViewportMode(state.viewportMode),
    series: state.tickers.map(ticker => adaptTicker(ticker, state)),
  }
}

function adaptTicker(ticker: HostTicker, state: HostRrgState): RrgRenderSeries {
  return {
    ticker: ticker.symbol,
    label: ticker.symbol,
    name: ticker.name,
    visible: state.visibleTickers.has(ticker.symbol),
    color: ticker.color,
    points: ticker.rrgPoints.map(point => ({
      date: point.date,
      x: point.rsRatio,      // RS-Ratio maps to x
      y: point.rsMomentum,   // RS-Momentum maps to y
      quadrant: deriveQuadrant(point.rsRatio, point.rsMomentum),
    })),
  }
}

function deriveQuadrant(x: number, y: number): 'leading' | 'weakening' | 'lagging' | 'improving' {
  if (x >= 100 && y >= 100) return 'leading'
  if (x >= 100 && y < 100)  return 'weakening'
  if (x < 100  && y < 100)  return 'lagging'
  return 'improving'
}

function adaptViewportMode(mode: string): 'fit' | 'max' | 'center' {
  if (mode === 'fit' || mode === 'max' || mode === 'center') return mode
  return 'fit'
}
```

**Critical constraint:** The adapter contains all knowledge of the host app's internal state shape. The `vue-relative-rotation-chart` package must not import anything from the host application.

### Step 3: Implement the Feature Flag

Add a `renderer` query parameter handler in the host app:

```ts
// src/utils/rendererFlag.ts
export type ChartRenderer = 'echarts' | 'svg'

export function getRendererFlag(): ChartRenderer {
  const param = new URLSearchParams(window.location.search).get('renderer')
  if (param === 'svg' || param === 'echarts') return param
  return 'echarts'  // default: existing renderer
}
```

For development, the flag is also readable from a localStorage override:
```ts
export function getRendererFlag(): ChartRenderer {
  const param = new URLSearchParams(window.location.search).get('renderer')
  if (param === 'svg' || param === 'echarts') return param
  const local = localStorage.getItem('rrg-renderer') as ChartRenderer | null
  if (local === 'svg' || local === 'echarts') return local
  return 'echarts'
}
```

### Step 4: Wire the Renderer Switch

In the host app's chart container component, conditionally render the correct renderer:

```vue
<template>
  <div class="chart-container">
    <!-- Existing ECharts renderer -->
    <RrgECharts
      v-if="renderer === 'echarts'"
      :series="echartsSeriesData"
      :options="chartOptions"
    />

    <!-- New SVG renderer -->
    <RrgChart
      v-else-if="renderer === 'svg'"
      :series="rrgChartInput.series"
      :selected-date="rrgChartInput.selectedDate"
      :tail-length="rrgChartInput.tailLength"
      :viewport-mode="rrgChartInput.viewportMode"
      :label-mode="labelMode"
      @point-hover="handlePointHover"
      @point-click="handlePointClick"
      @point-leave="handlePointLeave"
    />
  </div>
</template>

<script setup lang="ts">
import { RrgChart } from 'vue-relative-rotation-chart'
import { adaptToRrgChart } from '../adapters/rrgChartAdapter'
import { getRendererFlag } from '../utils/rendererFlag'

const renderer = getRendererFlag()
const rrgChartInput = computed(() => adaptToRrgChart(currentRrgState.value))
</script>
```

---

## Verification Checklist

After wiring, verify the following manually:

**ECharts renderer (default):**
- [ ] Navigate to the chart page without any query params → ECharts renders
- [ ] All existing interactions work (hover, replay, viewport toggle)
- [ ] No TypeScript errors introduced

**SVG renderer:**
- [ ] Navigate with `?renderer=svg` → SVG renderer renders
- [ ] All tickers appear at correct positions
- [ ] Replay / playback works — `selectedDate` changes update the chart
- [ ] Prefer wiring [`RrgPlaybackControls`](./C12-playback-controls.md) (C12) instead of the legacy ambiguous host slider when available
- [ ] Hover shows tooltip with correct ticker/data values
- [ ] Viewport mode toggle works (fit/max/center)
- [ ] `data-testid` attributes are present (check in DevTools)

**Data consistency:**
- [ ] Same ticker, same date → same x/y position in both renderers
- [ ] Same tail length → same number of tail points in both renderers
- [ ] Debug panel values (if present) match SVG chart point values

**Regression:**
- [ ] Switching between renderers (via URL param) does not cause app errors
- [ ] Normal navigation without the flag always shows ECharts
- [ ] No calculation code was changed

---

## Unit Tests (in the host application)

```
tests/
  rrgChartAdapter.test.ts
    - adaptToRrgChart maps rsRatio → x and rsMomentum → y
    - deriveQuadrant is correct for all four quadrant positions
    - visible tickers are mapped correctly
    - hidden tickers have visible: false
    - adaptViewportMode falls back to 'fit' for unknown values
```

---

## Notes

- The ECharts renderer remains the **default** until an explicit decision is made to switch defaults (post-C11 review)
- The `?renderer=svg` flag is for development and QA only in v1; it is not a user-facing feature
- Once the SVG renderer is validated in production, a follow-up task (not part of this unit) can make `svg` the default and eventually remove the ECharts code path
- Side-by-side comparison: if useful, temporarily enable both renderers stacked in development mode for visual comparison

---

## Acceptance Criteria

- [ ] `vue-relative-rotation-chart` installed as a workspace / `file:` link in the host application
- [ ] Renderer adapter `src/adapters/rrgChartAdapter.ts` created with correct field mappings
- [ ] Feature flag `?renderer=svg` toggles to SVG renderer
- [ ] Feature flag `?renderer=echarts` (or no flag) uses ECharts renderer
- [ ] ECharts renderer still works without regression
- [ ] SVG renderer renders correct tickers at correct positions
- [ ] Both renderers consume the same calculated data (no separate calculation path)
- [ ] Zero changes to any RRG calculation code
- [ ] Debug panel values (if present in the host app) match SVG chart point positions
- [ ] `npm run typecheck` passes in both repos
- [ ] Adapter unit tests pass
