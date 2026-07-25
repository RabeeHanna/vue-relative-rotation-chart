# tests

## Purpose

Vitest unit and contract tests for the library.

## Belongs here

- `*.test.ts` covering components, composables, utils, and public types
- Happy-dom component mount tests
- Playwright smoke under `e2e/` (`npm run test:e2e`)
- C17 perf harness under `perf/` (Vitest every PR; Playwright via `npm run test:perf`)

## Does not belong here

- Spike prototypes (`spikes/`)
- Demo UI (except exercise via e2e/perf against `demo/`)

## Depends on

- `src/`
- Vitest + `@vue/test-utils`

## Used by

- `npm test` / CI
- Agents verifying each unit before commit
