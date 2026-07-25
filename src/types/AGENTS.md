# types

## Purpose

Public TypeScript contract for the package.

## Belongs here

- `rrg.ts` — `RrgRenderSeries`, chart/playback props, emits, viewport/label modes
- `copy.ts` — `RrgChartCopy` / `RrgPlaybackCopy`, merge helpers, English defaults
- `defaults.ts` — `RRG_CHART_DEFAULTS` / `RRG_PLAYBACK_DEFAULTS`
- JSDoc documenting caller assumptions (sorted dates, no validation)

## Does not belong here

- Internal-only layout types (keep next to composables unless exported on purpose)
- Host application / consumer app types
- Runtime logic beyond small constant defaults and copy merge helpers

## Depends on

- Nothing in `components/` / `composables/`

## Used by

- Entire package + external consumers via `src/index.ts`
