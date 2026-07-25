# C3: Static SVG Axes and Quadrants

**Phase:** Foundation  
**Estimate:** 1–2 days  
**Depends on:** C2 complete  
**Priority:** Standard

---

## Goal

Render the complete static chart surface: SVG root, x/y scales, grid, 100/100 center lines, quadrant labels, and axis tick labels — with no ticker data required yet. The result should look like a plain technical report chart, not a dashboard widget.

---

## Scope

### Components to Implement

**`RrgSvgRoot.vue`**
- Wrapper `<svg>` element with correct dimensions and viewBox
- Responsive sizing: fills container width by default; fixed if `width`/`height` props are set
- Inner `<g>` transform for chart margin/padding (the "plot area")
- Provides plot area dimensions to child components via `provide()`
- Accepts margin props internally (e.g. `{ top: 20, right: 20, bottom: 40, left: 50 }`)

**`RrgAxes.vue`**
- Receives x/y scale functions from `useRrgScales`
- Renders x-axis ticks and labels at the bottom
- Renders y-axis ticks and labels at the left
- Uses D3's `axisBottom` and `axisLeft` for tick generation (math only — renders as Vue SVG, not D3 DOM manipulation)
- Grid lines: faint horizontal and vertical lines at each tick position
- Center vertical line at `x = 100` (distinct weight/color)
- Center horizontal line at `y = 100` (distinct weight/color)
- Axis labels: "RS-Ratio →" on x-axis, "RS-Momentum ↑" on y-axis

**`RrgQuadrants.vue`**
- Renders four quadrant label text elements
- Positions:
  - "Leading" — top-right quadrant, near corner
  - "Weakening" — bottom-right quadrant, near corner
  - "Lagging" — bottom-left quadrant, near corner
  - "Improving" — top-left quadrant, near corner
- Labels are muted/quiet by default — present but not competing with data
- Controlled by `showQuadrantLabels` prop

---

### Composables to Implement

**`useRrgScales.ts`**

```ts
import { scaleLinear } from 'd3-scale'
import type { ComputedRef } from 'vue'

export function useRrgScales(
  domain: ComputedRef<RrgDomain>,
  plotWidth: ComputedRef<number>,
  plotHeight: ComputedRef<number>
) {
  const xScale = computed(() =>
    scaleLinear()
      .domain([domain.value.xMin, domain.value.xMax])
      .range([0, plotWidth.value])
  )

  const yScale = computed(() =>
    scaleLinear()
      .domain([domain.value.yMin, domain.value.yMax])
      .range([plotHeight.value, 0])   // SVG y is inverted
  )

  return { xScale, yScale }
}
```

Key constraint: D3 scales are used as pure math functions only. They are called in Vue `computed()` to derive pixel positions. D3 never touches the DOM.

**`useRrgViewport.ts`** (stub for C3, fully implemented in C8)

For C3 purposes, implement a simple default domain:

```ts
export function useRrgViewport(/* stub */) {
  return computed(() => ({
    xMin: 90,
    xMax: 110,
    yMin: 90,
    yMax: 110,
  }))
}
```

This stub is replaced with real logic in C8.

---

### Utilities to Implement

**`src/utils/ticks.ts`**

```ts
import { ticks } from 'd3-array'

// Generate readable tick values for a given domain
export function generateTicks(min: number, max: number, targetCount = 5): number[] {
  return ticks(min, max, targetCount)
}
```

---

## Chart Aesthetics — Target Look

The chart should look like a **plain technical reporting chart**, similar to a Bloomberg terminal or StockCharts data table view:

- White or very light gray background
- Thin, hairline grid lines (low opacity)
- Clean axis lines with simple tick marks
- No decorative borders, shadows, or rounded corners on the chart area
- Axis labels in small, readable serif or sans-serif font
- 100/100 center lines slightly heavier or more distinct than grid lines (but still subtle)
- Quadrant labels in muted color, small size, positioned in corner of each quadrant

**Not:** 
- Colorful axes
- Bold borders
- Dashboard aesthetic
- Chart.js or ECharts default styling

---

## CSS Variables

All colors via CSS variables. Defaults (light/reporting style):

```css
:root {
  --rrg-bg: #ffffff;
  --rrg-grid: rgba(0, 0, 0, 0.08);
  --rrg-axis: rgba(0, 0, 0, 0.3);
  --rrg-center-line: rgba(0, 0, 0, 0.25);
  --rrg-axis-label: rgba(0, 0, 0, 0.5);
  --rrg-quadrant-label: rgba(0, 0, 0, 0.15);
}
```

Dark mode override (set on `.dark` class or via scoped CSS vars on the component):
```css
.dark {
  --rrg-bg: #1a1a2e;
  --rrg-grid: rgba(255, 255, 255, 0.08);
  --rrg-axis: rgba(255, 255, 255, 0.3);
  --rrg-center-line: rgba(255, 255, 255, 0.25);
  --rrg-axis-label: rgba(255, 255, 255, 0.5);
  --rrg-quadrant-label: rgba(255, 255, 255, 0.12);
}
```

---

## `RrgChart.vue` Wiring for C3

`RrgChart.vue` should wire these components together for this unit. It can accept the full props type (from C2) but only use `width`, `height`, `showGrid`, `showAxes`, `showQuadrantLabels` for now:

```vue
<template>
  <RrgSvgRoot :width="width" :height="height">
    <RrgAxes v-if="showAxes" :x-scale="xScale" :y-scale="yScale" />
    <RrgQuadrants v-if="showQuadrantLabels" :x-scale="xScale" :y-scale="yScale" />
  </RrgSvgRoot>
</template>
```

---

## Unit Tests

Write unit tests for the utilities and composables:

```
tests/
  useRrgScales.test.ts
    - xScale maps domain min to pixel 0
    - xScale maps domain max to plot width
    - yScale maps domain min to plot height (SVG inverted y)
    - yScale maps domain max to pixel 0
    - scales update reactively when domain changes

  ticks.test.ts
    - generateTicks(90, 110, 5) returns sensible tick values
    - generateTicks with equal min/max doesn't throw
```

---

## Acceptance Criteria

- [ ] SVG renders with correct aspect ratio responsive to container
- [ ] x-axis (RS-Ratio) renders at bottom with readable tick labels
- [ ] y-axis (RS-Momentum) renders at left with readable tick labels
- [ ] Grid lines render at tick positions (subtle, not distracting)
- [ ] Center vertical line at x=100 renders (slightly more visible than grid)
- [ ] Center horizontal line at y=100 renders (slightly more visible than grid)
- [ ] Quadrant labels ("Leading", "Weakening", "Lagging", "Improving") visible but quiet
- [ ] `showGrid`, `showAxes`, `showQuadrantLabels` props hide respective elements
- [ ] CSS variable theming works — dark and light themes both render correctly
- [ ] Chart looks like a plain technical report, not a dashboard widget
- [ ] `npm run typecheck` passes
- [ ] Unit tests for scales and tick generation pass
