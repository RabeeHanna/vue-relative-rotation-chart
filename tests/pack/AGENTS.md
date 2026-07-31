# tests/pack

## Purpose

npm tarball verification: required `dist/` artifacts and clean consumer install/build smoke.

## Belongs here

- `packConsumer.test.ts` — dry-run listing + consumer fixture
- `consumer-fixture/` — minimal Vite app (not shipped)

## Does not belong here

- Production chart code
- Playwright perf harness (`tests/perf/`)

## Depends on

- Built `dist/` from `npm run build`
- `scripts/prepack-check.mjs`

## Used by

- CI (`ci.yml`, `publish.yml`)
- `npm test`
