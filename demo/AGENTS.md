# demo

## Purpose

Local Vite playground for visual development and adoption of `RrgChart` (C13).

## Belongs here

- App shell (`main.ts`, `DemoApp.vue`, `DemoControls.vue`, `DemoAdvanced.vue`, `DemoChartHost.vue`)
- Scenario registry + fixtures (`scenarios.ts`, `longPlayback.ts`; `adversarialMocks.ts` re-exports for C11 tests)
- Playground helpers (`copySnippet.ts`, `generateSeries.ts`, `parseSeriesJson.ts`, `demoUrl.ts`, `demoSession.ts`, `useDemoAppState.ts`)
- Power-user panel (`DemoPowerUser.vue` — radii, speeds, selectedTicker, CSS vars)
- Tab session persistence (`sessionStorage` via `demoSession.ts` — C13.5)
- Baseline mocks (`mockSeries.ts`)

## Does not belong here

- Production library entrypoints
- Published package code (demo is not part of `dist/` exports)
- RRG calculation or market data fetching

## Depends on

- `src/` via direct imports during `npm run dev`

## Used by

- Developers running `npm run dev` at http://localhost:5173
- Vitest suites under `tests/demo.*.test.ts` and `tests/adversarialMocks.test.ts`
