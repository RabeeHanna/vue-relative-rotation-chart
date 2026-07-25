# C7: Hover, Tooltip, and Selection Events

**Phase:** Interaction  
**Estimate:** 1–2 days  
**Depends on:** C6 complete  
**Priority:** Standard

---

## Goal

Make the chart explorable. Implement hover state, tooltip, fading of unrelated tickers, and event emission to parent apps. Keep scope strictly limited — no advanced selection modes, no multi-ticker tools in v1.

---

## Scope Boundary (Important)

C7 implements exactly:
- Hover state tracking
- Tooltip showing ticker, name, x, y, quadrant, date
- Highlighted hovered ticker (full opacity)
- Faded unrelated tickers
- Three emitted events: `pointHover`, `pointLeave`, `pointClick`

C7 does **not** implement:
- Solo/isolate mode (show only one ticker)
- Multi-ticker selection
- Click-to-lock hover
- External synchronization of highlighted state (that comes from parent via `highlightedTicker` prop, already in C2 types)

---

## Components to Implement

### `RrgTooltip.vue`

A plain overlay tooltip that appears near the hovered point.

```vue
<template>
  <g
    v-if="hoveredPoint"
    class="rrg-tooltip"
    :transform="`translate(${tooltipX}, ${tooltipY})`"
  >
    <!-- Tooltip background rectangle -->
    <rect
      :width="tooltipWidth"
      :height="tooltipHeight"
      rx="3"
      fill="var(--rrg-tooltip-bg)"
      stroke="var(--rrg-axis)"
      stroke-width="0.5"
    />
    <!-- Tooltip content lines -->
    <text dy="14" dx="8" font-size="11" fill="var(--rrg-label)" font-weight="600">
      {{ hoveredPoint.ticker }}
      <tspan v-if="hoveredPoint.name" font-weight="normal" fill="var(--rrg-axis-label)">
        {{ ' ' + hoveredPoint.name }}
      </tspan>
    </text>
    <text dy="28" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      {{ hoveredPoint.date }}
    </text>
    <text dy="41" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      RS-Ratio: {{ hoveredPoint.x.toFixed(2) }}
    </text>
    <text dy="54" dx="8" font-size="10" fill="var(--rrg-axis-label)">
      RS-Momentum: {{ hoveredPoint.y.toFixed(2) }}
    </text>
    <text dy="67" dx="8" font-size="10" fill="var(--rrg-axis-label)" text-transform="capitalize">
      Quadrant: {{ hoveredPoint.quadrant }}
    </text>
  </g>
</template>
```

Tooltip positioning rules:
- Default: render to the right of the point
- If point is in right half of chart: render to the left instead
- If point is near top: render below instead
- Always stay within the SVG bounds

Tooltip CSS variables:
```css
--rrg-tooltip-bg: rgba(255, 255, 255, 0.95);    /* light */
--rrg-tooltip-bg: rgba(20, 20, 30, 0.95);        /* dark */
```

---

## Composable to Implement

**`useRrgHoverState.ts`**

```ts
import { ref, computed } from 'vue'
import type { RrgRenderPoint } from '../types/rrg'

export function useRrgHoverState() {
  const hoveredTicker = ref<string | null>(null)
  const hoveredPoint = ref<RrgRenderPoint | null>(null)

  function onPointEnter(point: RrgRenderPoint) {
    hoveredTicker.value = point.ticker
    hoveredPoint.value = point
  }

  function onPointLeave() {
    hoveredTicker.value = null
    hoveredPoint.value = null
  }

  function onPointClick(point: RrgRenderPoint) {
    // Click state is managed by parent — we only emit
    // No internal selection state in v1
  }

  return {
    hoveredTicker: computed(() => hoveredTicker.value),
    hoveredPoint: computed(() => hoveredPoint.value),
    onPointEnter,
    onPointLeave,
    onPointClick,
  }
}
```

---

## Hover Interaction on Points

`RrgPoints.vue` handles pointer events:

```vue
<circle
  v-for="point in currentPoints"
  :key="point.ticker"
  ...
  @pointerenter="$emit('pointEnter', point)"
  @pointerleave="$emit('pointLeave')"
  @click="$emit('pointClick', point)"
  :style="{ cursor: 'pointer' }"
/>
```

**Pointer events use `pointerenter`/`pointerleave` (not `mouseenter`/`mouseleave`)** for touch device compatibility and SVG reliability.

The `<circle>` hit area may be too small at 5–6px radius. Expand the invisible hit target:

```vue
<!-- Invisible larger hit area -->
<circle
  :cx="cx"
  :cy="cy"
  r="12"
  fill="transparent"
  @pointerenter="..."
  @pointerleave="..."
  @click="..."
/>
<!-- Visible styled circle -->
<circle
  :cx="cx"
  :cy="cy"
  :r="pointRadius"
  :fill="color"
  ...
  style="pointer-events: none"
/>
```

---

## Opacity Behavior During Hover

When any ticker is hovered, other tickers fade:

**Points:**
- Hovered point: `opacity = 1`
- Other points: `opacity = 0.25`

**Tails:**
- Hovered tail: full opacity (as rendered by `useRrgTailSlices`)
- Other tails: `opacity` of each segment multiplied by `0.2`

**Labels:**
- Hovered ticker label: always visible, `opacity = 1`
- Other labels: `opacity = 0.3` (or `0` if already hidden in auto mode)

Implementation: `RrgTails.vue` and `RrgPoints.vue` already accept `hoveredTicker` prop (prepared in C5/C4). Wire the hover state to these props in `RrgChart.vue`:

```ts
const { hoveredTicker, hoveredPoint, onPointEnter, onPointLeave, onPointClick } = useRrgHoverState()
```

---

## Event Emission from `RrgChart.vue`

```ts
const emit = defineEmits<{
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
  pointClick: [point: RrgRenderPoint]
}>()

// Wire internal hover state to external events
watch(hoveredPoint, (point) => {
  if (point) emit('pointHover', point)
  else emit('pointLeave')
})
```

**Payload for `pointHover` and `pointClick`:**
```ts
{
  ticker: string
  label: string
  name?: string
  x: number           // data value (not pixel)
  y: number           // data value (not pixel)
  quadrant: RrgQuadrant
  date: string        // the selectedDate at time of hover
  color?: string
}
```

The event includes `date` (the current selected date) so the parent app can sync table rows.

---

## Externally Controlled Highlight

The `highlightedTicker` prop (from C2 types) allows the parent to set the highlighted ticker from outside (e.g. hovering a table row). When `highlightedTicker` is set:
- It overrides internal hover state for opacity/emphasis purposes
- It does not conflict with `hoveredTicker` — they can both be active simultaneously

Implementation:

```ts
const effectiveHoveredTicker = computed(() =>
  hoveredTicker.value ?? props.highlightedTicker ?? null
)
```

---

## Unit Tests

```
tests/
  useRrgHoverState.test.ts
    - onPointEnter sets hoveredTicker and hoveredPoint
    - onPointLeave clears both
    - hoveredPoint contains correct x, y, ticker, quadrant values
    - multiple sequential enters: state always reflects most recent

  RrgChart interactions (using @vue/test-utils):
    - pointHover event emitted when point is entered
    - pointLeave event emitted when pointer leaves
    - pointClick event emitted on click with correct payload
    - highlightedTicker prop changes effective hover without user interaction
```

---

## Acceptance Criteria

- [ ] Hovering a point shows tooltip with: ticker, name (if present), date, x (RS-Ratio), y (RS-Momentum), quadrant
- [ ] Tooltip stays within SVG bounds (smart repositioning near edges)
- [ ] Hovered point renders at full opacity
- [ ] Hovered tail renders at full opacity and on top of other tails
- [ ] Unrelated points fade to low opacity on hover
- [ ] Unrelated tails fade to low opacity on hover
- [ ] Hovered ticker label is always revealed (regardless of labelMode)
- [ ] `pointHover` event emitted with correct `RrgRenderPoint` payload
- [ ] `pointLeave` event emitted when pointer leaves
- [ ] `pointClick` event emitted with correct payload on click
- [ ] `highlightedTicker` prop from parent overrides hover emphasis
- [ ] Leaving the chart area clears hover state completely
- [ ] `npm run typecheck` passes
- [ ] Unit tests for hover state pass
