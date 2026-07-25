# C5: Tail Rendering

**Phase:** Rendering Core  
**Estimate:** 2–3 days  
**Depends on:** C4 complete  
**Priority:** Standard — includes mandatory performance smoke test

---

## Goal

Render readable ticker trails (tails) with opacity fade from oldest to newest segment. Each segment is an independent SVG path element with its own opacity, enabling fine-grained visual age indication. Includes a performance smoke test that establishes the rendering ceiling before further work proceeds.

---

## Scope

### Components to Implement

**`RrgTails.vue`**

Renders each ticker's tail as a series of `<line>` or `<path>` elements — one per segment between consecutive points.

```vue
<template>
  <g class="rrg-tails">
    <g
      v-for="tail in tailData"
      :key="tail.ticker"
      :class="['rrg-tail', { 'rrg-tail--hovered': tail.ticker === hoveredTicker }]"
      :data-testid="`rrg-tail-${tail.ticker}`"
    >
      <line
        v-for="(segment, i) in tail.segments"
        :key="i"
        :x1="segment.x1"
        :y1="segment.y1"
        :x2="segment.x2"
        :y2="segment.y2"
        :stroke="tail.color"
        :stroke-width="tailStrokeWidth"
        :stroke-opacity="segment.opacity"
        :stroke-linecap="'round'"
        class="rrg-tail-segment"
      />
    </g>
  </g>
</template>
```

Key requirements:
- Each `<line>` segment has its own `stroke-opacity` — this is the core opacity fade mechanism
- Segments connect consecutive points in order: `points[0]→points[1]`, `points[1]→points[2]`, etc.
- Oldest segments have lowest opacity; newest segments have highest opacity
- Z-order: hovered ticker's tail group renders last (on top of others) — handled by reordering `tailData`
- `data-testid="rrg-tail-{ticker}"` on the tail group

---

### Composables to Implement

**`useRrgTailSlices.ts`** (complete implementation — extends the partial from C4)

```ts
export function useRrgTailSlices(
  series: ComputedRef<RrgRenderSeries[]>,
  selectedDate: ComputedRef<string>,
  tailLength: ComputedRef<number>,
  xScale: ComputedRef<ScaleLinear>,
  yScale: ComputedRef<ScaleLinear>,
) {
  // Current points (implemented in C4)
  const currentPoints = computed(/* ... */)

  // Tail segments per ticker
  const tailData = computed(() => {
    return series.value
      .filter(s => s.visible !== false)
      .map(s => {
        // Find index of selectedDate in the series
        const endIdx = s.points.findIndex(p => p.date === selectedDate.value)
        if (endIdx < 0) return null

        // Take up to tailLength points ending at selectedDate (inclusive)
        const startIdx = Math.max(0, endIdx - tailLength.value + 1)
        const tailPoints = s.points.slice(startIdx, endIdx + 1)

        // Convert to segments with opacity
        const segments = tailPoints.slice(0, -1).map((point, i) => {
          const next = tailPoints[i + 1]
          // Opacity: oldest = low, newest = high
          const progress = i / Math.max(tailPoints.length - 2, 1)
          const opacity = TAIL_OPACITY_MIN + progress * (TAIL_OPACITY_MAX - TAIL_OPACITY_MIN)
          return {
            x1: xScale.value(point.x),
            y1: yScale.value(point.y),
            x2: xScale.value(next.x),
            y2: yScale.value(next.y),
            opacity,
            date: next.date,
          }
        })

        return { ticker: s.ticker, color: s.color, segments }
      })
      .filter(Boolean)
  })

  return { currentPoints, tailData }
}

const TAIL_OPACITY_MIN = 0.1   // oldest segment opacity
const TAIL_OPACITY_MAX = 0.85  // newest segment opacity (point itself is 1.0)
```

Critical constraints:
- `tailLength` is respected exactly — never include points after `selectedDate`
- No future points: only points at or before `selectedDate` are included
- Points are sorted oldest → newest in the tail (ascending by date index)
- `xScale`/`yScale` applied here so `RrgTails.vue` only receives pixel coordinates

---

## Opacity Fade Design

| Position in tail | Opacity |
|------------------|---------|
| Oldest segment   | 0.10    |
| ...              | (linear interpolation) |
| 2nd newest       | ~0.60   |
| Newest segment   | 0.85    |
| Current point    | 1.00    |

The opacity values above are defaults. They should be configurable via internal constants (not props) for now. If v2 needs prop-based opacity control, it can be added then.

---

## Hover Emphasis (Preparation for C7)

`RrgTails.vue` should accept a `hoveredTicker` prop now (even though hover state is implemented in C7). This allows the tail rendering to adapt without architectural changes in C7:

```ts
// RrgTails.vue props
const props = defineProps<{
  tailData: TailData[]
  hoveredTicker: string | null
}>()
```

When `hoveredTicker` is set:
- That ticker's tail renders last (on top via SVG paint order)
- Other tickers' segments get a reduced opacity multiplier (e.g. × 0.3) to fade them

For C5, `hoveredTicker` defaults to `null` — full implementation in C7.

---

## Performance Smoke Test

**This is a mandatory gate before proceeding past C5.**

After implementing tail rendering, run a performance test with the worst-case dataset:

### Test Setup

Create a performance mock in `tests/performance/tailRenderPerf.ts`:

```ts
// Generate 50 tickers × 30 points
const stressMock = generateStressMock({ tickers: 50, pointsPerTicker: 30 })
```

### Measurements to Take

1. **Initial render time**: mount the component with 50 tickers × 30 tail points; measure time from mount to first paint
2. **Date-change render time**: simulate a replay step (change `selectedDate`); measure update time
3. **Frame rate**: simulate 30 rapid date changes (replay animation); count frames per second
4. **SVG DOM element count**: count total `<line>` elements in DOM after render (should be ≈ 50 × 29 = 1,450)

### Acceptance Thresholds

Define thresholds based on what is achievable on an ordinary development laptop (MacBook Air M1 or equivalent):

| Metric | Target | Acceptable |
|--------|--------|------------|
| Initial render (50×30) | < 50ms | < 100ms |
| Date-change update | < 16ms (1 frame) | < 32ms |
| Replay frame rate | ≥ 55 fps | ≥ 30 fps |
| SVG element count | ≤ 1,500 | ≤ 2,000 |

### If Performance is Insufficient

If the 50-ticker target cannot be achieved at ≥ 55 fps:
1. Try `shallowRef()` for the series input to avoid deep Vue reactivity overhead
2. Try `v-memo` on individual tail groups
3. Try replacing individual `<line>` elements with a single compound `<path>` per ticker (loses per-segment hover, but faster)
4. **If still failing after optimizations**: scope v1 to 30 tickers, document the ceiling, and note that 50+ requires Canvas/WebGL

**Do not proceed to C6 without documenting the performance baseline and ceiling**, even if the ceiling is lower than 50 tickers.

---

## Performance Utilities

```ts
// src/utils/perf.ts
export function generateStressMock(options: {
  tickers: number
  pointsPerTicker: number
  startDate?: string
}): RrgRenderSeries[] {
  // Generate synthetic series for performance testing
  // Tickers clustered near 100/100 with realistic noise
}
```

---

## Unit Tests

```
tests/
  useRrgTailSlices.test.ts (extend from C4)
    - tail segments are ordered oldest → newest
    - tail respects tailLength exactly (no extra points)
    - no future points included (endIdx is the selectedDate index)
    - single-point tail produces no segments
    - opacity of newest segment is greater than oldest segment
    - opacity values are in range [0, 1]
    - xScale/yScale are applied to segment coordinates

  tests/performance/tailRenderPerf.test.ts
    - 50 tickers × 30 points: initial render < 100ms
    - date change update < 32ms
    - SVG element count matches expected (tickers × (tailLength - 1))
```

---

## Demo Scenarios to Add

Extend `demo/mockSeries.ts` with:
- `longTailMock`: 10 tickers with 30 tail points each
- `stressMock`: 50 tickers with 30 tail points each (for performance testing)

---

## Acceptance Criteria

- [ ] Tail segments render for all visible tickers
- [ ] Segments are ordered oldest → newest (oldest end of trail is dimmest)
- [ ] Opacity fade is visually clear: oldest is nearly transparent, newest is strong
- [ ] `tailLength` is respected exactly — count of segments = min(tailLength, available points) - 1
- [ ] No future points are included (only points at or before `selectedDate`)
- [ ] Current point (rendered by `RrgPoints.vue`) remains visually strongest element
- [ ] Hovered ticker tail can be visually emphasised (prep for C7 — works with stub `hoveredTicker=null`)
- [ ] `data-testid="rrg-tail-{ticker}"` on each tail group
- [ ] **PERF: Initial render of 50×30 completes in < 100ms**
- [ ] **PERF: Date-change update completes in < 32ms**
- [ ] **PERF: Replay at 30 date steps stays ≥ 30fps minimum (target ≥ 55fps)**
- [ ] Performance baseline and v1 ticker ceiling documented
- [ ] `npm run typecheck` passes
- [ ] All unit tests pass
