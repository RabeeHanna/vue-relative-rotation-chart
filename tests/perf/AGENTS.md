# tests/perf

## Purpose

C17 performance harness + C20 bundle-size checks: deterministic Vitest invariants (every PR), Playwright FPS (nightly / manual), and post-build dist size ceilings.

## Belongs here

- Vitest `*.test.ts` — hard node-count gates, soft JSDOM date-patch timings, package exclusion, **bundle size** (`bundleSize.ts`), helpers
- Playwright `*.spec.ts` — Chromium FPS for P0/P2 (scrub + play); optional ceiling via `PERF_CEILING=1`
- Shared helpers (`expectedTailNodes.ts`, `fpsMetrics.ts`, `perfHarness.ts`, `bundleSize.ts`)

## Does not belong here

- Production chart code (`src/`)
- Interactive demo UI (`demo/DemoPerfPanel.vue` — convenience only)
- Contributor playbook prose (`docs/perf.md`)
- Shipping in the npm package (`files: ["dist"]` only)

## Depends on

- Long-playback fixtures / scenarios
- Demo app for Playwright (`npm run test:perf`)
- Built `dist/` for `npm run check:bundle-size` (CI runs this after `npm run build`)
- Locked decisions in `plans/C17-research.md`; C20 in `plans/C20-bundle-size-perf-playbook.md`

## Used by

- `npm test` (Layer A Vitest via `tests/**/*.test.ts`; bundle IO skipped if `dist/` absent)
- `npm run check:bundle-size` (requires `dist/`)
- `npm run test:perf` + `.github/workflows/perf-nightly.yml` (Layer B)
- Playbook: [`docs/perf.md`](../../docs/perf.md)
