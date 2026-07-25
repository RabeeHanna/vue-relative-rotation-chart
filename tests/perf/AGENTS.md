# tests/perf

## Purpose

C17 performance harness: deterministic Vitest invariants (every PR) and Playwright FPS specs (nightly / manual).

## Belongs here

- Vitest `*.test.ts` — hard node-count gates, soft JSDOM date-patch timings, package exclusion, helpers
- Playwright `*.spec.ts` — Chromium FPS for P0/P2 (scrub + play); optional ceiling via `PERF_CEILING=1`
- Shared helpers (`expectedTailNodes.ts`, `fpsMetrics.ts`, `perfHarness.ts`)

## Does not belong here

- Production chart code (`src/`)
- Interactive demo UI (`demo/DemoPerfPanel.vue` — convenience only)
- Shipping in the npm package (`files: ["dist"]` only)

## Depends on

- Long-playback fixtures / scenarios
- Demo app for Playwright (`npm run test:perf`)
- Locked decisions in `plans/C17-research.md`

## Used by

- `npm test` (Layer A Vitest via `tests/**/*.test.ts`)
- `npm run test:perf` + `.github/workflows/perf-nightly.yml` (Layer B)
