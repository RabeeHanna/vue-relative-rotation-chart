# components

## Purpose

Declarative Vue SFCs that own SVG/DOM structure for the chart.

## Belongs here

- `RrgChart.vue` (public wrapper)
- Chart parts: `RrgSvgRoot`, `RrgAxes`, `RrgQuadrants`, `RrgPoints`, `RrgTails`, `RrgLabels`, `RrgTooltip`
- `RrgPlaybackControls.vue` — timeline UI composed beside the chart, not inside SVG
- `RrgPlaybackTransportIcon.vue` — SVG glyphs for playback transport buttons
- `RrgViewportControls.vue` — fit / max / center viewport modes
- `RrgSeriesVisibilityControls.vue` — show / hide / solo / restore tickers
- `RrgDisplaySettingsControls.vue` — tail length, label mode, tail fade
- `RrgChartControlsPanel.vue` — composed viewport + display + visibility shell
- `data-testid` hooks for Playwright inspectability

## Does not belong here

- Hatch pattern fills (deprecated / removed — prefer `tickerLabelAlwaysVisible`)
- Scale/domain math (composables)
- Pure geometry helpers (utils)
- Public type definitions (types)

## Depends on

- `composables/` for derived state
- `types/rrg.ts` for props/emits

## Used by

- `src/index.ts` (exports `RrgChart`)
- Demo app
