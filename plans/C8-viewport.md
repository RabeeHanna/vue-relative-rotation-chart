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
| `fit` | Extent of visible current points **and** their tails, plus padding. **No outlier clipping** (PRE-C1-B Fit-All). |
| `max` | Shows the full loaded x/y range across all series points (all dates). |
| `center` | Fixed symmetric window around 100/100, configurable radius. |

The default mode is `fit`.

**PRE-C1-B decision:** [`PRE-C1-B-outlier-strategy.md`](./PRE-C1-B-outlier-strategy.md) — Fit-All (data extent + padding, no clipping).

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
  fitPadding?: number           // padding added to fit data extent (default: 5)
  maxPadding?: number           // padding added to max extent (default: 2)
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
    maxPadding = 2,
  } = options

  return computed((): RrgDomain => {
    switch (viewportMode.value) {
      case 'center':
        return centerDomain(centerRadius)
      case 'max':
        return maxDomain(series.value, maxPadding)
      case 'fit':
      default:
        return fitDomain(series.value, selectedDate.value, tailLength.value, fitPadding)
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
function maxDomain(series: RrgRenderSeries[], pad = 2): RrgDomain {
  const allX = series.flatMap(s => s.points.map(p => p.x))
  const allY = series.flatMap(s => s.points.map(p => p.y))
  const [xMin, xMax] = extent(allX) as [number, number]
  const [yMin, yMax] = extent(allY) as [number, number]
  return { xMin: xMin - pad, xMax: xMax + pad, yMin: yMin - pad, yMax: yMax + pad }
}
```

**`fitDomain`** — Fit-All from PRE-C1-B (no outlier clipping)

```ts
function fitDomain(
  series: RrgRenderSeries[],
  selectedDate: string,
  tailLength: number,
  padding: number,
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

  const [xMin, xMax] = extent(allVisibleX) as [number, number]
  const [yMin, yMax] = extent(allVisibleY) as [number, number]

  // Optional: round to 0.5 for replay stability
  const round = (v: number) => Math.floor(v * 2) / 2

  return {
    xMin: round(xMin - padding),
    xMax: round(xMax + padding),
    yMin: round(yMin - padding),
    yMax: round(yMax + padding),
  }
}
```

**`src/utils/bounds.ts`**
```ts
/** Shared helpers for domain math (extent padding, rounding). Percentile clipping is not used in v1. */
export function padExtent(
  min: number,
  max: number,
  padding: number,
): [number, number] {
  return [min - padding, max + padding]
}

export function roundDomainBound(value: number, step = 0.5): number {
  return Math.floor(value / step) * step
}
```

---

## Stability Requirements

The viewport must be **stable** during date replay — axes must not jump or jitter as `selectedDate` changes. This is especially critical for `fit` mode where the domain recalculates each frame.

Implementation notes to ensure stability:
- The domain calculation is `computed()` — it reacts to `selectedDate` changes correctly without extra watchers
- In `fit` mode, round domain bounds to the nearest 0.5 unit to reduce small frame-to-frame jumps: `Math.floor(min × 2) / 2`
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

Per [`PRE-C1-B`](./PRE-C1-B-outlier-strategy.md): **Fit-All — no outlier clipping.**

**Validation**: After implementing `fitDomain`, manually test with this scenario:
- 15 tickers clustered between 98–103
- 1 ticker at x=145, y=60
- Expected: viewport expands to include the outlier; cluster appears smaller (accepted)
- Contrast: switch to `center` for a fixed 100±radius window; switch to `max` for full-history extent

---

## Unit Tests

```
tests/
  useRrgViewport.test.ts
    - center mode returns domain centered on 100 with correct radius
    - center mode is not affected by series data
    - max mode returns bounds covering all series points
    - max mode adds padding beyond extent
    - fit mode: clustered data produces tight domain (extent + padding)
    - fit mode: single outlier expands domain to include it (Fit-All)
    - fit mode: selectedDate change updates domain reactively
    - fit mode: empty visible points falls back to center domain
    - fit vs max: fit uses current+tails only; max uses all dates

  bounds.test.ts
    - padExtent applies padding symmetrically
    - roundDomainBound rounds down to step
```

---

## Demo Scenarios to Add

Extend `demo/mockSeries.ts` with:
- `outlierMock`: 10 tickers near 100/100 plus one at 145/65
- `widespreadMock`: tickers spread across all four quadrants, testing max mode

---

## Acceptance Criteria

- [ ] `fit` mode produces a readable viewport for default sector-like clustered data
- [ ] `fit` mode applies Fit-All from PRE-C1-B (data extent + padding; no outlier clipping)
- [ ] Scenario: 15 tickers near 100/100 + 1 at 145/65 — fit mode keeps outlier on-chart
- [ ] `max` mode shows the full range of all loaded series data
- [ ] `center` mode produces a stable symmetric window around 100/100
- [ ] `center` mode accepts configurable radius prop
- [ ] No axis jitter or viewport jump during date replay in any mode
- [ ] All three modes keep 100/100 center lines visible where data allows
- [ ] `viewportMode` prop changes reactively update the chart
- [ ] `npm run typecheck` passes
- [ ] Unit tests for all three domain calculation functions pass
