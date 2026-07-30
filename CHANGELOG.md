# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-07-30

### Changed

- README and npm metadata optimized for discoverability (RRG / relative rotation graph keywords, FAQ, concise API reference)
- Expanded `package.json` keywords for sector rotation, RS-Ratio, RS-Momentum, and Vue chart searches

## [0.1.0] - 2026-07-25

First deliberate public cut: rotation-specialist Vue SVG renderer (no fetch/calc).

### Added

- **`RrgChart`** — SVG RRG-style chart from precomputed `RrgRenderSeries[]` (axes, quadrants, points, tails, spatial-bin labels, hover/tooltip, tail hit targets); ref exposes `getSvgElement` / `exportPng` for PNG export
- **`RrgPlaybackControls`** — controlled timeline UI with `v-model:selected-date`, `v-model:playing`, `v-model:speed`, `v-model:loop`; `labelStyle` (`icon` \| `icon-text`); responsive `layout` (`auto` \| `stacked` \| `inline`) with mobile touch targets
- **Chart controls (à la carte or composed)** — `RrgViewportControls`, `RrgSeriesVisibilityControls` (show/hide/solo/restore), `RrgDisplaySettingsControls` (tail length, label mode, tail fade), optional `RrgChartControlsPanel` shell with `sections` prop
- **`useRrgSeriesVisibility` helpers** — `applyVisibleTickers`, `soloTicker`, `showAllTickers`, `hideAllTickers`, etc.
- **SVG export utils** — `exportSvgElementAsPng`, `serializeSvgElement`, `svgMarkupToDataUrl`
- Typed public contract (`RrgRenderPoint`, `RrgRenderSeries`, `RrgQuadrant`, viewport/label modes) and CSS variable theming + `vue-relative-rotation-chart/style.css`
- Optional `copy` overrides (`RrgChartCopy` / `RrgPlaybackCopy`) for quadrant, tooltip, a11y, and control labels
- Viewport modes `fit` \| `max` \| `center` (Fit-All product default); date snap / empty-state via `resolveChartDate` (`data-date-status`)
- Scrub coalesce (chart date ≤1 update per animation frame) and stable tail segment keys for smoother scrubbing
- Optional `vue-relative-rotation-chart/scenarios` fixture subpath
- Vite demo playground (scenarios, Simple/Customize controls, copy-as-code, session persistence, GitHub Pages build)
- Packaging / trust: MIT, CONTRIBUTING, SECURITY, CI (typecheck, lint, Vitest, e2e), peer Vue only
- Perf hygiene: Vitest node-count gates, soft FPS harness (`npm run test:perf`), bundle-size soft warn (`npm run check:bundle-size`), `docs/perf.md`

### Notes

- Renderer-only: callers supply precomputed series; no price fetch or RRG calculation in-package
- `RrgQuadrant` is the fixed four-value enum (`leading` \| `weakening` \| `lagging` \| `improving`) in this release
- Default product mode uses capped `tailLength`; full-history LOD remains deferred
- C17 FPS budgets are soft / nightly — not a hard PR gate
- Bundle-size baselines updated for C22/C23 controls panel + mobile playback CSS (see `tests/perf/bundleSize.ts`)
