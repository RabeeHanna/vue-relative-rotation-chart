# C4: Points and Current Frame Rendering

**Phase:** Foundation  
**Estimate:** 1 day  
**Depends on:** C3 complete  
**Priority:** Standard

---

## Goal

Render each visible ticker's current point position for a selected date. Add ticker labels in the simple non-collision case. Add stable DOM hooks (`data-testid`) that Playwright can inspect.

---

## Scope

### Components to Implement

**`RrgPoints.vue`**

Renders a `<circle>` for each visible ticker at its current x/y position.

```vue
<template>
  <g class="rrg-points">
    <circle
      v-for="point in currentPoints"
      :key="point.ticker"
      :cx="xScale(point.x)"
      :cy="yScale(point.y)"
      :r="pointRadius"
      :fill="point.color"
      :stroke="'var(--rrg-point-stroke)'"
      :stroke-width="1.5"
      :data-testid="`rrg-point-${point.ticker}`"
      :data-ticker="point.ticker"
      :data-x="point.x"
      :data-y="point.y"
      :data-quadrant="point.quadrant"
      class="rrg-point"
    />
  </g>
</template>
```

Key requirements:
- `data-testid="rrg-point-{ticker}"` — stable, consistent, lowercase ticker symbol
- `data-x`, `data-y`, `data-quadrant` — additional attributes for Playwright assertions
- Point radius: 5–6px default
- Current points are visually stronger than their tails (higher opacity, slightly larger)
- Points are on top of tails in z-order (SVG render order)

**`RrgLabels.vue`** (simple case — full collision system in C6)

For C4, implement labels in "simple" mode — no collision detection, just render at a fixed offset from the point. This will be replaced/augmented in C6.

```vue
<template>
  <g class="rrg-labels">
    <text
      v-for="point in labeledPoints"
      :key="point.ticker"
      :x="xScale(point.x) + labelOffsetX"
      :y="yScale(point.y) + labelOffsetY"
      :fill="'var(--rrg-label)'"
      font-size="11"
      font-family="inherit"
      :data-testid="`rrg-label-${point.ticker}`"
      class="rrg-label"
    >
      {{ point.label }}
    </text>
  </g>
</template>
```

For C4: `labelOffsetX = 8`, `labelOffsetY = -8` (upper-right of point). No collision logic yet.

---

### Composables to Implement

**`useRrgTailSlices.ts`** (partial — only current-frame logic needed for C4)

```ts
export function useRrgTailSlices(
  series: ComputedRef<RrgRenderSeries[]>,
  selectedDate: ComputedRef<string>
) {
  // Current points: find each series' point matching selectedDate
  const currentPoints = computed((): RrgRenderPoint[] => {
    return series.value
      .filter(s => s.visible !== false)
      .map(s => {
        const point = s.points.find(p => p.date === selectedDate.value)
        if (!point) return null
        return {
          ticker: s.ticker,
          label: s.label,
          name: s.name,
          x: point.x,
          y: point.y,
          quadrant: point.quadrant,
          color: s.color,
        }
      })
      .filter(Boolean) as RrgRenderPoint[]
  })

  return { currentPoints }
}
```

Notes:
- If `selectedDate` doesn't exactly match any point's date for a series, that ticker is not rendered (no interpolation)
- Series with `visible: false` are completely excluded
- The full tail-slicing logic (for rendering trails) is added in C5

---

### Color Assignment

If a series has no `color` defined, assign from a deterministic palette:

```ts
// src/utils/colors.ts
const DEFAULT_PALETTE = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
  '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
  '#9c755f', '#bab0ac',
]

export function assignSeriesColors(series: RrgRenderSeries[]): RrgRenderSeries[] {
  return series.map((s, i) => ({
    ...s,
    color: s.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length],
  }))
}
```

Color assignment must be:
- Deterministic (same index → same color on every render)
- Applied once in `RrgChart.vue` using `computed()`, not in the template
- Not recalculated when unrelated state changes

---

## Wiring in `RrgChart.vue`

```vue
<template>
  <RrgSvgRoot :width="width" :height="height">
    <RrgAxes v-if="showAxes" />
    <RrgQuadrants v-if="showQuadrantLabels" />
    <RrgTails />        <!-- stub from C5, renders nothing yet -->
    <RrgPoints :current-points="currentPoints" />
    <RrgLabels :points="currentPoints" />
  </RrgSvgRoot>
</template>
```

Z-order matters in SVG (later elements are rendered on top). Order:
1. Axes / grid (bottom)
2. Quadrant labels
3. Tails (behind points)
4. Points (on top of tails)
5. Labels (on top of points)
6. Tooltip (topmost)

---

## Mock Data for Demo (extend in `demo/mockSeries.ts`)

Add a simple 5-ticker mock dataset for visual verification:

```ts
export const simpleMock: RrgRenderSeries[] = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    points: [
      { date: '2024-01-05', x: 104.2, y: 102.1, quadrant: 'leading' },
      { date: '2024-01-12', x: 105.1, y: 101.8, quadrant: 'leading' },
      { date: '2024-01-19', x: 103.8, y: 103.2, quadrant: 'leading' },
    ],
  },
  // ... 4 more tickers spread across quadrants
]
```

---

## Unit Tests

```
tests/
  useRrgTailSlices.test.ts
    - currentPoints returns correct point for selectedDate
    - currentPoints excludes series where visible = false
    - currentPoints returns empty if selectedDate not in any series
    - currentPoints returns empty array for empty series input

  colors.test.ts
    - assignSeriesColors assigns palette colors to series without color
    - assignSeriesColors preserves explicit color values
    - color assignment is deterministic (same input → same output)
```

---

## Acceptance Criteria

- [ ] All visible tickers render as circles at correct x/y SVG positions
- [ ] Date lookup: `selectedDate` correctly maps to the right point in each series
- [ ] Series with `visible: false` are not rendered
- [ ] Each point has `data-testid="rrg-point-{ticker}"` attribute
- [ ] Each point has `data-x`, `data-y`, `data-quadrant` attributes with correct values
- [ ] Labels render at fixed offset in simple non-overlapping case
- [ ] Each label has `data-testid="rrg-label-{ticker}"` attribute
- [ ] Color assignment is deterministic — same ticker always gets same color
- [ ] Points render on top of tails (z-order correct)
- [ ] Points are inspectable and locatable by Playwright via `data-testid`
- [ ] `npm run typecheck` passes
- [ ] Unit tests for date lookup, filtering, and color assignment pass
