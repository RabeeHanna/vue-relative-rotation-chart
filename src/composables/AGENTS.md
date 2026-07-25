# composables

## Purpose

Reactive derivation between props and renderable chart state.

## Belongs here

- `useRrgScales`, `useRrgViewport`, `useRrgTailSlices`
- `useRrgLabelLayout` (Spatial Bin — PRE-C1-A)
- `useRrgHoverState`
- `useRrgPlayback` / `useRrgPlaybackControls` (C12 timeline)
- `useRrgChartSummary` (accessible SVG title/desc)

## Does not belong here

- SVG markup (components)
- Stateless pure helpers that need no `ref`/`computed` (prefer `utils/`)
- Fetching or RRG score calculation

## Depends on

- `types/rrg.ts`
- D3 math helpers / `utils/` as needed

## Used by

- Chart components under `components/`
