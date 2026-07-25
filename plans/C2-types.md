# C2: Public Data Contract and Types

**Phase:** Foundation  
**Estimate:** 0.5–1 day  
**Depends on:** C1 complete, [PRE-C1-C](./PRE-C1-C-accessibility-requirements.md) decisions documented  
**Priority:** Standard

---

## Goal

Define and export the complete public TypeScript API of the component — the data contract that Sector Orbit (and any future consumer) will use. No Sector Orbit-specific types may appear in this package's public API.

---

## Why Types Come Before Implementation

The types are the API contract. Every component, composable, and utility written in C3–C11 is an implementation of this contract. Defining them first:
- Forces explicit thinking about what data the component needs
- Prevents Sector Orbit state shapes from leaking in
- Makes the adapter boundary in C10 obvious and well-defined
- Gives autocomplete and type-checking from the first line of component code

---

## Scope

All types live in `src/types/rrg.ts` and are re-exported from `src/index.ts`.

---

## Core Data Types

### `RrgRenderPoint`

Represents a single ticker's position at a specific moment in time.

```ts
export type RrgRenderPoint = {
  ticker: string              // symbol, e.g. "XLK"
  label: string               // display label, typically same as ticker
  name?: string               // full name, e.g. "Technology Select Sector SPDR"
  x: number                   // RS-Ratio value (horizontal axis)
  y: number                   // RS-Momentum value (vertical axis)
  quadrant: RrgQuadrant       // derived from x/y position
  color?: string              // optional override; component assigns default if omitted
}
```

### `RrgQuadrant`

```ts
export type RrgQuadrant = 'leading' | 'weakening' | 'lagging' | 'improving'
```

Quadrant definitions (based on x=100, y=100 center):
- `leading`: x > 100, y > 100 (top-right)
- `weakening`: x > 100, y < 100 (bottom-right)
- `lagging`: x < 100, y < 100 (bottom-left)
- `improving`: x < 100, y > 100 (top-left)

### `RrgRenderSeries`

Represents a ticker's full historical trail (all loaded dates).

```ts
export type RrgRenderSeries = {
  ticker: string
  label: string
  name?: string
  points: RrgSeriesPoint[]    // full history, sorted oldest → newest by date
  color?: string              // assigned by component if omitted
  visible?: boolean           // default true; false hides from all rendering
}

export type RrgSeriesPoint = {
  date: string                // ISO 8601 date string, e.g. "2024-03-15"
  x: number
  y: number
  quadrant: RrgQuadrant
}
```

### `RrgChartInput`

The complete input to the chart component (matches the props shape for convenience).

```ts
export type RrgChartInput = {
  selectedDate: string        // ISO date string; selects the current frame
  series: RrgRenderSeries[]   // all visible and hidden series
  tailLength: number          // how many historical points to show as tail (1–30+)
  viewportMode: RrgViewportMode
}

export type RrgViewportMode = 'fit' | 'max' | 'center'
```

---

## Component Props Type

```ts
export type RrgChartProps = {
  // Required
  series: RrgRenderSeries[]
  selectedDate: string

  // Optional rendering controls
  tailLength?: number               // default: 10
  viewportMode?: RrgViewportMode    // default: 'fit'
  labelMode?: RrgLabelMode          // default: 'auto'
  showQuadrantLabels?: boolean      // default: true
  showGrid?: boolean                // default: true
  showAxes?: boolean                // default: true

  // Optional interaction state (controlled from parent)
  highlightedTicker?: string | null
  selectedTicker?: string | null

  // Optional dimensions
  width?: number                    // default: responsive to container
  height?: number                   // default: responsive to container

  // Accessibility (see PRE-C1-C — both props required in the public contract)
  showPatterns?: boolean            // default false; hatch patterns in addition to color (render in C9)
  tickerLabelAlwaysVisible?: boolean // default false; override collision hide; always show all labels
}

export type RrgLabelMode = 'auto' | 'always' | 'hover'
```

---

## Component Emits Type

```ts
export type RrgChartEmits = {
  // Fired when user hovers over a ticker point
  pointHover: [point: RrgRenderPoint]

  // Fired when hover leaves a ticker point
  pointLeave: []

  // Fired when user clicks a ticker point
  pointClick: [point: RrgRenderPoint]
}
```

---

## Internal Types (not exported)

These are used internally but do not appear in the package public API:

```ts
// Resolved label position after collision layout
type ResolvedLabel = {
  ticker: string
  x: number           // SVG pixel x of label anchor
  y: number           // SVG pixel y of label anchor
  visible: boolean    // false if hidden by collision system
  offsetX: number     // pixel offset from point center
  offsetY: number     // pixel offset from point center
}

// Tail segment for rendering (derived from series points)
type TailSegment = {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number     // 0.0 (oldest) → 1.0 (newest)
  date: string
}

// Computed viewport domain
type RrgDomain = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}
```

---

## Type Export in `src/index.ts`

```ts
export { default as RrgChart } from './components/RrgChart.vue'

export type {
  RrgRenderPoint,
  RrgRenderSeries,
  RrgSeriesPoint,
  RrgChartInput,
  RrgChartProps,
  RrgChartEmits,
  RrgQuadrant,
  RrgViewportMode,
  RrgLabelMode,
} from './types/rrg'
```

---

## Assumptions Documented in Types

Add JSDoc comments to the types file documenting:
1. `selectedDate` must exactly match one of the `date` strings in the series points
2. `points` within a series must be sorted oldest → newest by date
3. The component does not validate or transform input data — malformed input produces undefined rendering behavior
4. `x` and `y` values are expected to be on the RS-Ratio/RS-Momentum scale (centered near 100); no normalization is applied

---

## Acceptance Criteria

- [ ] All types listed above are defined in `src/types/rrg.ts`
- [ ] All public types are exported from `src/index.ts`
- [ ] `RrgChartProps` includes `showPatterns` and `tickerLabelAlwaysVisible` (from PRE-C1-C)
- [ ] No Sector Orbit-specific types appear anywhere in the package (`AppState`, `TickerData`, etc.)
- [ ] No data-fetching, async, or calculation types included
- [ ] `npm run typecheck` passes after types are added
- [ ] Types are documented with JSDoc comments on key fields
- [ ] Internal types are defined locally in composables/components — not exported from the package
