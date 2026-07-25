# tests

## Purpose

Vitest unit and contract tests for the library.

## Belongs here

- `*.test.ts` covering components, composables, utils, and public types
- Happy-dom component mount tests

## Does not belong here

- Playwright e2e (lives under `tests/e2e/` only when C9 adds it)
- Spike prototypes (`spikes/`)
- Demo UI

## Depends on

- `src/`
- Vitest + `@vue/test-utils`

## Used by

- `npm test` / CI
- Agents verifying each unit before commit
