# composables

## Purpose

Reactive derivation between props and renderable chart state.

## Belongs here

- `useRrgScales`, `useRrgViewport`, `useRrgTailSlices`
- `useSeriesIndex` (C38 — memoized date/point index per `series` reference)
- `useRrgChartDimensions` (resolved SVG/plot box from host measure or props)
- `useRrgLabelLayout` (Spatial Bin — PRE-C1-A)
- `useRrgHoverState`
- `useRrgPlayback` / `useRrgPlaybackControls` (C12 timeline)
- `useRrgChartSummary` (accessible SVG title/desc)
- `useRrgChartChrome` (empty state + PNG export helpers for `RrgChart`)
- `useRrgSeriesVisibility` helpers (C23 — apply/filter visible tickers)

## Does not belong here

- SVG markup (components)
- Stateless pure helpers that need no `ref`/`computed` (prefer `utils/`)
- Fetching or RRG score calculation

## Depends on

- `types/rrg.ts`
- D3 math helpers / `utils/` as needed

## Used by

- Chart components under `components/`
