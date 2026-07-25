# types

## Purpose

Public TypeScript contract for the package.

## Belongs here

- `rrg.ts` — `RrgRenderSeries`, `RrgChartProps`, emits, viewport/label modes, defaults
- JSDoc documenting caller assumptions (sorted dates, no validation)

## Does not belong here

- Internal-only layout types (keep next to composables unless exported on purpose)
- Sector Orbit app types
- Runtime logic beyond small constant defaults (`RRG_CHART_DEFAULTS`)

## Depends on

- Nothing in `components/` / `composables/`

## Used by

- Entire package + external consumers via `src/index.ts`
