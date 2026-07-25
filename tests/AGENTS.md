# tests

## Purpose

Vitest unit and contract tests for the library.

## Belongs here

- `*.test.ts` covering components, composables, utils, and public types
- Happy-dom component mount tests
- Playwright smoke under `e2e/` (`npm run test:e2e`)

## Does not belong here

- Spike prototypes (`spikes/`)
- Demo UI

## Depends on

- `src/`
- Vitest + `@vue/test-utils`

## Used by

- `npm test` / CI
- Agents verifying each unit before commit
