# vue-relative-rotation-chart

## Purpose

Standalone Vue 3 SVG package that renders RRG-style relative rotation charts from **precomputed** series data.

## Belongs here

- Public chart API (`RrgChart`, exported types)
- SVG rendering, viewport modes, label collision, hover/tooltip
- Vitest unit tests, Vite demo playground, spikes

## Does not belong here

- Price fetching or RRG score calculation
- Host application shell, routing, or stores
- Backend / API services

## Depends on

- Vue 3, Vite, TypeScript, Vitest
- D3 subpackages for math only (`d3-scale`, `d3-array`)

## Used by

- Host applications via npm, workspace, or git link
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
| `spikes/` | Throwaway prototypes |

See each directory's `AGENTS.md` for placement rules. Contributor workflow: [CONTRIBUTING.md](CONTRIBUTING.md).
