# C8: Viewport Modes

**Phase:** Rendering Core  
**Estimate:** 1–2 days  
**Depends on:** C5 complete, PRE-C1-B (outlier strategy) decided  
**Priority:** Standard

---

## Goal

Implement the `fit`, `max`, and `center` viewport modes. Replace the stub domain in `useRrgViewport.ts` with real domain calculation logic. The viewport must be stable — no jitter or jumping during date replay.

---

## Background

The viewport controls which region of the x/y space is visible. Three modes are supported:

| Mode | Behavior |
|------|----------|
| `fit` | Focuses on the visible current points and visible tails with padding. Applies the outlier strategy decided in PRE-C1-B. |
| `max` | Shows the full loaded x/y range across all series points (all dates). |
| `center` | Fixed symmetric window around 100/100, configurable radius. |

The default mode is `fit`.

---

## Scope

### Composable to Implement

**`useRrgViewport.ts`** (full implementation, replacing C3 stub)

```ts
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { RrgRenderSeries, RrgViewportMode, RrgDomain } from '../types/rrg'
import { extent } from 'd3-array'

export interface ViewportOptions {
  centerRadius?: number         // for 'center' mode (default: 10, i.e. 90–110)
  fitPadding?: number           // padding added to fit bounds (default: 5)
  fitPercentileLow?: number     // low percentile for fit outlier clipping (default: 0.05)
  fitPercentileHigh?: number    // high percentile for fit outlier clipping (default: 0.95)
}

export function useRrgViewport(
  series: ComputedRef<RrgRenderSeries[]>,
  selectedDate: ComputedRef<string>,
  tailLength: ComputedRef<number>,
  viewportMode: ComputedRef<RrgViewportMode>,
  options: ViewportOptions = {}
): ComputedRef<RrgDomain> {

  const {
    centerRadius = 10,
    fitPadding = 5,
    fitPercentileLow = 0.05,
    fitPercentileHigh = 0.95,
  } = options

  return computed((): RrgDomain => {
    switch (viewportMode.value) {
      case 'center':
        return centerDomain(centerRadius)
      case 'max':
        return maxDomain(series.value)
      case 'fit':
      default:
        return fitDomain(series.value, selectedDate.value, tailLength.value, fitPadding, fitPercentileLow, fitPercentileHigh)
    }
  })
}
```

### Domain Calculation Functions

**`centerDomain`**
```ts
function centerDomain(radius: number): RrgDomain {
  return {
    xMin: 100 - radius,
    xMax: 100 + radius,
    yMin: 100 - radius,
    yMax: 100 + radius,
  }
}
```

**`maxDomain`**
```ts
function maxDomain(series: RrgRenderSeries[]): RrgDomain {
  const allX = series.flatMap(s => s.points.map(p => p.x))
  const allY = series.flatMap(s => s.points.map(p => p.y))
  const [xMin, xMax] = extent(allX) as [number, number]
  const [yMin, yMax] = extent(allY) as [number, number]
  const pad = 2
  return { xMin: xMin - pad, xMax: xMax + pad, yMin: yMin - pad, yMax: yMax + pad }
}
```

**`fitDomain`** — implements the outlier strategy from PRE-C1-B

```ts
function fitDomain(
  series: RrgRenderSeries[],
  selectedDate: string,
  tailLength: number,
  padding: number,
  pLow: number,
  pHigh: number,
): RrgDomain {
  // Collect all visible points: current frame + tail points
  const visibleSeries = series.filter(s => s.visible !== false)
  const allVisibleX: number[] = []
  const allVisibleY: number[] = []

  for (const s of visibleSeries) {
    const endIdx = s.points.findIndex(p => p.date === selectedDate)
    if (endIdx < 0) continue
    const startIdx = Math.max(0, endIdx - tailLength + 1)
    const slice = s.points.slice(startIdx, endIdx + 1)
    slice.forEach(p => {
      allVisibleX.push(p.x)
      allVisibleY.push(p.y)
    })
  }

  if (allVisibleX.length === 0) return centerDomain(10)

  // Apply percentile-based outlier clipping (from PRE-C1-B decision)
  const xBounds = percentileBounds(allVisibleX, pLow, pHigh)
  const yBounds = percentileBounds(allVisibleY, pLow, pHigh)

  return {
    xMin: xBounds[0] - padding,
    xMax: xBounds[1] + padding,
    yMin: yBounds[0] - padding,
    yMax: yBounds[1] + padding,
  }
}
```

**`src/utils/bounds.ts`**
```ts
export function percentileBounds(values: number[], low: number, high: number): [number, number] {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const lowIdx = Math.floor(low * (n - 1))
  const highIdx = Math.ceil(high * (n - 1))
  return [sorted[lowIdx], sorted[highIdx]]
}
```

---

## Stability Requirements

The viewport must be **stable** during date replay — axes must not jump or jitter as `selectedDate` changes. This is especially critical for `fit` mode where the domain recalculates each frame.

Implementation notes to ensure stability:
- The domain calculation is `computed()` — it reacts to `selectedDate` changes correctly without extra watchers
- In `fit` mode, small floating-point variations in percentile bounds between frames can cause subtle axis movement. Consider rounding domain bounds to the nearest 0.5 unit: `Math.floor(min × 2) / 2`
- In `max` mode, domain only changes when new series data is loaded — not during replay
- In `center` mode, domain never changes

---

## Viewport Reactivity

`useRrgViewport` is called from `RrgChart.vue` and its return value passed down to `useRrgScales`:

```ts
// RrgChart.vue setup
const domain = useRrgViewport(series, selectedDate, tailLength, viewportMode)
const { xScale, yScale } = useRrgScales(domain, plotWidth, plotHeight)
```

All child components receive `xScale` and `yScale` via `provide()` or props — they never call `useRrgViewport` directly.

---

## Outlier Strategy Implementation

Per the decision in PRE-C1-B, implement the chosen strategy here. The code above shows the percentile-based approach. If a different strategy was selected in PRE-C1-B, adapt accordingly.

**Validation**: After implementing `fitDomain`, manually test with this scenario:
- 15 tickers clustered between 98–103
- 1 ticker at x=145, y=60
- Expected: viewport focuses on the 98–103 cluster; the outlier at 145/60 is off-chart
- Verify by: switch to `max` mode and confirm outlier becomes visible

---

## Unit Tests

```
tests/
  useRrgViewport.test.ts
    - center mode returns domain centered on 100 with correct radius
    - center mode is not affected by series data
    - max mode returns bounds covering all series points
    - max mode adds padding beyond extent
    - fit mode: clustered data produces tight domain
    - fit mode: single outlier does not expand domain to include it (percentile-based)
    - fit mode: selectedDate change updates domain reactively
    - fit mode: empty visible points falls back to center domain

  bounds.test.ts
    - percentileBounds([1,2,3,4,5], 0, 1) returns [1, 5]
    - percentileBounds([...], 0.05, 0.95) excludes extreme values
    - percentileBounds handles single-element array
```

---

## Demo Scenarios to Add

Extend `demo/mockSeries.ts` with:
- `outlierMock`: 10 tickers near 100/100 plus one at 145/65
- `widespreadMock`: tickers spread across all four quadrants, testing max mode

---

## Acceptance Criteria

- [ ] `fit` mode produces a readable viewport for default sector-like clustered data
- [ ] `fit` mode applies the outlier strategy from PRE-C1-B (percentile clipping or chosen alternative)
- [ ] Scenario: 15 tickers near 100/100 + 1 at 145/65 — fit mode shows cluster clearly, outlier off-chart
- [ ] `max` mode shows the full range of all loaded series data
- [ ] `center` mode produces a stable symmetric window around 100/100
- [ ] `center` mode accepts configurable radius prop
- [ ] No axis jitter or viewport jump during date replay in any mode
- [ ] All three modes keep 100/100 center lines visible where data allows
- [ ] `viewportMode` prop changes reactively update the chart
- [ ] `npm run typecheck` passes
- [ ] Unit tests for all three domain calculation functions pass
