# vue-relative-rotation-chart

## Purpose

Standalone Vue 3 SVG package that renders RRG-style relative rotation charts from **precomputed** series data.

## Belongs here

- Public chart API (`RrgChart`, exported types)
- SVG rendering, viewport modes, label collision, hover/tooltip
- Vitest unit tests, Vite demo playground, plan specs, spikes

## Does not belong here

- Price fetching or RRG score calculation
- Host application shell, routing, or stores
- Backend / API services

## Depends on

- Vue 3, Vite, TypeScript, Vitest
- D3 subpackages for math only (`d3-scale`, `d3-axis`, `d3-shape`, `d3-array`)
- Decisions in `plans/` (PRE-C1-A Spatial Bin, PRE-C1-B Fit-All, PRE-C1-C a11y props)

## Used by

- Host applications via `file:` / workspace / git link (integration unit C10)
- Local demo (`npm run dev`)

## Agent map

| Path | Role |
|------|------|
| `src/components/` | Vue SVG UI |
| `src/composables/` | Reactive chart logic |
| `src/types/` | Public contract |
| `src/utils/` | Pure helpers |
| `src/scenarios/` | Published fixture series (`/scenarios` subpath) |
| `demo/` | Dev playground |
| `tests/` | Vitest suites |
| `plans/` | Unit-of-work specs |
| `spikes/` | Throwaway prototypes |

See each directory’s `AGENTS.md` for placement rules. Cursor rules live in `.cursor/rules/`.
