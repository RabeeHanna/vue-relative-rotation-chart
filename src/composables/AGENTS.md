# composables

## Purpose

Reactive derivation between props and renderable chart state.

## Belongs here

- `useRrgScales`, `useRrgViewport`, `useRrgTailSlices`
- `useSeriesIndex` — memoized date/point index per `series` reference
- `useRrgChartDimensions` — resolved SVG/plot box from host measure or props
- `useRrgLabelLayout` — spatial bin label placement
- `useRrgHoverState`
- `useRrgPlayback` / `useRrgPlaybackControls` — timeline playback
- `useRrgChartSummary` — accessible SVG title/desc
- `useRrgChartChrome` — empty state + PNG export helpers for `RrgChart`
- `useRrgSeriesVisibility` — apply/filter visible tickers

## Does not belong here

- SVG markup (components)
- Stateless pure helpers that need no `ref`/`computed` (prefer `utils/`)
- Fetching or RRG score calculation

## Depends on

- `types/rrg.ts`
- D3 math helpers / `utils/` as needed

## Used by

- Chart components under `components/`
