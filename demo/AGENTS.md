# demo

## Purpose

Local Vite playground for visual development and adoption of `RrgChart`.

## Belongs here

- App shell (`main.ts`, `DemoApp.vue`, `DemoControls.vue`, `DemoAdvanced.vue`, `DemoChartHost.vue`)
- Public surface: scenario picker, theme, chart + controls + playback
- Snippet behind a closed `<details>`; tail / full-history helper copy
- Scenario catalog / UI metadata (`scenarios.ts`; series fixtures imported from `src/scenarios`)
- Thin re-exports (`mockSeries.ts`, `longPlayback.ts`; `adversarialMocks.ts` for tests)
- Playground helpers (`copySnippet.ts`, `generateSeries.ts`, `parseSeriesJson.ts`, `demoUrl.ts`, `demoSession.ts`, `useDemoAppState.ts`)
- Full-history tail toggle (`fullHistoryTail`, off by default)
- Copy / labels overrides (`DemoCopyOverrides.vue`, `demoCopyFields.ts`)

## Dev harness only (`import.meta.env.DEV`)

- Agent state panel (`DemoAgentStatePanel.vue`, `?agent=1`)
- Stress generator, BYO JSON, compare mode (`DemoAdvanced.vue`)
- Perf sample overlay (`DemoPerfPanel.vue`, `demoPerfSample.ts`)
- Power-user panel (`DemoPowerUser.vue`)

## Does not belong here

- Production library entrypoints
- Published package code (demo is not part of `dist/` exports)
- RRG calculation or market data fetching

## Depends on

- `src/` via direct imports during `npm run dev`

## Used by

- Developers running `npm run dev` at http://localhost:5173
- Vitest suites under `tests/demo.*.test.ts` and `tests/adversarialMocks.test.ts`
