# C6: Label Collision System

**Phase:** Rendering Core  
**Estimate:** 3–5 days  
**Depends on:** C8 complete, PRE-C1-A (algorithm decision) complete  
**Priority:** Critical — this is the primary reason the component exists

---

## Goal

Replace the simple fixed-offset label rendering from C4 with a full label collision system that prevents unreadable label clusters in dense RRG charts. Implement the algorithm selected in PRE-C1-A.

---

## Why This Is the Hard Part

The primary pain point with existing RRG chart implementations is unreadable ticker labels when many tickers cluster near 100/100. This component only justifies its existence if it solves this problem.

The collision system must:
- Prevent two labels from occupying the same visual space
- Be deterministic (same data → same layout on every render)
- Be stable during date replay (labels do not jump between frames)
- Gracefully fall back: in `auto` mode, hide labels that cannot be cleanly placed rather than allowing overlaps
- Always reveal ticker identity on hover, even for hidden labels

---

## Scope

### Composable to Implement

**`useRrgLabelLayout.ts`**

This composable takes current point positions (in SVG pixel coordinates) and returns a resolved layout — a position and visibility state for each label.

```ts
import type { ComputedRef } from 'vue'
import type { RrgRenderPoint, RrgLabelMode } from '../types/rrg'

export type ResolvedLabel = {
  ticker: string
  x: number           // SVG x of label anchor
  y: number           // SVG y of label anchor
  visible: boolean    // false = hidden in auto mode (but still in DOM for hover)
  pointX: number      // SVG x of the point (for hover detection)
  pointY: number      // SVG y of the point
}

export function useRrgLabelLayout(
  currentPoints: ComputedRef<RrgRenderPoint[]>,
  labelMode: ComputedRef<RrgLabelMode>,
  xScale: ComputedRef<ScaleLinear>,
  yScale: ComputedRef<ScaleLinear>,
  options: LabelLayoutOptions = {}
): ComputedRef<ResolvedLabel[]>
```

### `LabelLayoutOptions`

```ts
export type LabelLayoutOptions = {
  offsetDistance?: number     // preferred right-of-point offset (default: 10px; from PRE-C1-A)
  labelHeight?: number        // estimated label height in px (default: 12)
  charWidth?: number          // estimated average character width in px (default: 7)
  collisionPadding?: number   // extra padding around label bounding box (default: 2)
  binWidth?: number           // spatial bin width (default: ceil(charWidth*3 + padding*2))
  binHeight?: number          // spatial bin height (default: labelHeight + padding*2)
}
```

---

## Algorithm Implementation

**Selected in PRE-C1-A:** Spatial Binning (Hybrid).  
Full decision, parameters, and spike artifacts: [`PRE-C1-A-label-collision-spike.md`](./PRE-C1-A-label-collision-spike.md#label-collision-algorithm-decision-completed)  
Prototype reference: `spikes/label-collision/spatialBin.ts`

Greedy Offset remains a documented fallback if replay stability on real data is unacceptable; do not ship Force-Directed for v1.

### Spatial Binning (Hybrid) — C6 target

```ts
const ADJACENT_ORDER: [number, number][] = [
  [0, 0], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1],
  [2, 0], [0, -2], [-2, 0], [0, 2],
  // plus outer-ring variants from PRE-C1-A spike
]

function computeLabelLayout(
  points: PixelPoint[], // sorted: label length asc, then ticker localeCompare
  options: LabelLayoutOptions,
): ResolvedLabel[] {
  const binW = options.binWidth ?? Math.ceil(options.charWidth * 3 + options.collisionPadding * 2)
  const binH = options.binHeight ?? options.labelHeight + options.collisionPadding * 2
  const occupied = new Set<string>()
  const placed: BoundingBox[] = []
  const results: ResolvedLabel[] = []

  for (const point of points) {
    const labelW = estimateLabelWidth(point.label, options.charWidth)
    const labelH = options.labelHeight
    const preferredX = point.px + options.offsetDistance
    const preferredY = point.py - labelH / 2
    const baseCol = Math.floor(preferredX / binW)
    const baseRow = Math.floor(preferredY / binH)

    let bestX: number | null = null
    let bestY: number | null = null

    for (const [dc, dr] of ADJACENT_ORDER) {
      const labelX = (baseCol + dc) * binW
      const labelY = (baseRow + dr) * binH
      const keys = binsCoveredByRect(labelX, labelY, labelW, labelH, binW, binH)
      if (keys.some((k) => occupied.has(k))) continue

      const box: BoundingBox = {
        x: labelX - options.collisionPadding,
        y: labelY - options.collisionPadding,
        w: labelW + options.collisionPadding * 2,
        h: labelH + options.collisionPadding * 2,
      }
      if (placed.some((existing) => intersects(box, existing))) continue

      for (const k of keys) occupied.add(k)
      placed.push(box)
      bestX = labelX
      bestY = labelY
      break
    }

    results.push({
      ticker: point.ticker,
      x: bestX ?? preferredX,
      y: bestY ?? preferredY,
      visible: bestX !== null,
      pointX: point.px,
      pointY: point.py,
    })
  }

  return results
}
```

### Sorting Strategy (for Determinism)

Points are processed in a fixed order to ensure deterministic placement. Sort by:
1. Primary: label length ascending (shorter labels are placed first — they're easier to fit)
2. Secondary: ticker symbol alphabetically (stable tiebreaker)

This order must remain constant across rerenders. Do not sort by position (positions change during replay).

### Label Size Estimation

```ts
function estimateLabelWidth(label: string, charWidth: number): number {
  return label.length * charWidth
}
```

This is an approximation. For C6, monospaced estimation is acceptable. A more accurate approach (using SVG `getComputedTextLength()`) can be added in v2 if label accuracy becomes a problem.

---

## Label Mode Behavior

| `labelMode` | Behavior |
|-------------|----------|
| `auto` (default) | Place labels where possible; hide if no clean slot. Reveal on hover. |
| `always` | Show all labels regardless of overlap. Collision system still runs for positioning, but `visible` is always `true`. |
| `hover` | All labels hidden by default. Reveal only the hovered ticker's label. |

When `tickerLabelAlwaysVisible` prop is `true` (from PRE-C1-C), it overrides `labelMode` and behaves like `always`.

---

## `RrgLabels.vue` (Full Implementation)

Replace the C4 stub with a proper implementation:

```vue
<template>
  <g class="rrg-labels">
    <text
      v-for="label in resolvedLabels"
      :key="label.ticker"
      :x="label.x"
      :y="label.y"
      :opacity="labelOpacity(label)"
      :fill="'var(--rrg-label)'"
      font-size="11"
      font-family="inherit"
      :data-testid="`rrg-label-${label.ticker}`"
      :data-visible="label.visible"
      class="rrg-label"
    >
      {{ getLabel(label.ticker) }}
    </text>
  </g>
</template>
```

Where `labelOpacity` returns:
- `1` if label is visible and not obscured by hover state
- `0` if hidden in auto mode (but element remains in DOM — for pointer-events and hover detection)
- `1` if `hoveredTicker === label.ticker` (always show hovered label)

Hidden labels have `opacity: 0` but remain in the DOM so:
- They can be revealed by hover without a DOM structure change
- Playwright can still find them if needed

---

## Stability During Replay

A critical requirement is that label positions are stable during date replay — labels must not jump between frames as `selectedDate` changes.

To achieve this:
- The sort order (label length + alphabetical) is independent of x/y position
- Therefore the placement order is consistent across frames
- If a label moves to a new point position (tail advancing), its slot priority is maintained

This should be tested explicitly: run the placement algorithm on 5 consecutive dates and assert that no label changes slot when the underlying data movement is small (< 2px).

---

## Unit Tests

```
tests/
  useRrgLabelLayout.test.ts
    - 5 widely-spaced points: all labels placed (visible = true)
    - 15 tickers clustered near 100/100: no two visible labels overlap
    - auto mode: some labels hidden when density is high
    - always mode: all labels visible = true regardless of overlap
    - hover mode: all labels visible = false initially
    - tickerLabelAlwaysVisible = true: overrides auto mode
    - label placement is deterministic: same input → same layout on two calls
    - label positions are stable: small point movement (< 2px) doesn't change placement
    - hidden labels have fallback position (not NaN or off-screen)
    
  bounds.test.ts (extend)
    - intersects(a, b) returns true when boxes overlap
    - intersects(a, b) returns false when boxes are adjacent (touching but not overlapping)
```

---

## Demo Scenarios

Add to `demo/mockSeries.ts`:
- `denseClusterMock`: 15+ tickers within ±5 units of 100/100 (from PRE-C1-A)
- Verify visually that this mock produces separated labels (the spike's result should be reproduced)

---

## Acceptance Criteria

- [ ] Dense cluster mock (15+ tickers near 100/100) produces no fused/overlapping visible labels
- [ ] `auto` mode hides labels where no clean placement exists
- [ ] `always` mode shows all labels regardless of collision
- [ ] `hover` mode shows labels only on hover
- [ ] `tickerLabelAlwaysVisible = true` overrides `auto` mode — all labels shown
- [ ] Hidden labels have `opacity: 0` but remain in DOM
- [ ] Hovered ticker label is always revealed regardless of `labelMode`
- [ ] Label placement algorithm matches the one selected in PRE-C1-A (**Spatial Binning**)
- [ ] Placement is deterministic: identical input → identical layout
- [ ] Label positions are stable during date replay (no jumping)
- [ ] Each label has `data-testid="rrg-label-{ticker}"` and `data-visible` attributes
- [ ] `npm run typecheck` passes
- [ ] Unit tests for collision detection, mode behavior, and determinism pass
