# components

## Purpose

Declarative Vue SFCs that own SVG/DOM structure for the chart.

## Belongs here

- `RrgChart.vue` (public wrapper)
- Chart parts: `RrgSvgRoot`, `RrgAxes`, `RrgQuadrants`, `RrgPoints`, `RrgTails`, `RrgLabels`, `RrgTooltip`
- `RrgPlaybackControls.vue` (C12 — timeline UI composed beside the chart, not inside SVG)
- `data-testid` hooks for Playwright/agent inspectability

## Does not belong here

- Scale/domain math (composables)
- Pure geometry helpers (utils)
- Public type definitions (types)

## Depends on

- `composables/` for derived state
- `types/rrg.ts` for props/emits

## Used by

- `src/index.ts` (exports `RrgChart`)
- Demo app
