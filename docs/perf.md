# Performance playbook

How to check chart smoothness and what to do when something feels slow.  
This package is a **renderer only** — measure the SVG chart paths below; do not chase host calc/fetch here.

## Automated layers (C17)

| Layer | Command | What it tells you |
|-------|---------|-------------------|
| **A** (every `npm test`) | `npm test` | Hard **node-count** invariants + soft JSDOM date-patch timings. Not FPS. |
| **B** (nightly / manual) | `npm run test:perf` | Chromium **rAF FPS** for P0 + P2 (scrub **and** play). Soft bar **≥55 fps**. |

- Soft FPS results and notes: [`plans/C17-results.md`](../plans/C17-results.md) (append-only).  
- Profile knobs / hot-path map: [`plans/C17-research.md`](../plans/C17-research.md).  
- Harness code: `tests/perf/` (does **not** ship in the npm tarball).

Optional local convenience: demo **Run perf sample** button — not the source of truth (Playwright is).

## Bundle size (C20)

Published `dist/` JS/CSS sizes are checked with a **hard ceiling** and a **soft warn** (~25% over recorded baseline):

```bash
npm run build
npm run check:bundle-size
```

Baselines and ceilings live in `tests/perf/bundleSize.ts`. If you intentionally grow the bundle, update the baseline in the same change and note why.

## Manual Chrome Performance (when FPS soft-fails or UI feels janky)

1. `npm run dev` — open the demo.  
2. Use a product-like URL, e.g.  
   - **P0:** `/?scenario=default&tailLength=10&labelMode=hover&viewportMode=fit`  
   - **P2:** `/?scenario=longPlayback200&tailLength=10&labelMode=hover&viewportMode=fit`  
3. Chrome DevTools → **Performance** → record while you **scrub** the timeline, then while you **Play**.  
4. Look for long tasks, scripting vs painting, and whether cost tracks **date changes** (viewport / tails / labels) vs idle.

### Symptom → likely area

| Symptom | Check first |
|---------|-------------|
| Scrub input feels laggy but chart updates ~1/frame | Playback UI / `scrubCoalesce` (coalesce is intentional) |
| FPS drops on every date step | `useRrgTailSlices`, `useRrgViewport`, `RrgTails.vue` patch |
| Dense labels stutter | `useRrgLabelLayout`, `labelMode` |
| Fine with capped `tailLength`, bad with Full history | DOM scale (`2×T×S` lines) — expected; see C17 full-history notes |
| Only bad with two charts | Demo compare mode (2× cost) |

Architecture detail: [`plans/C17-research.md`](../plans/C17-research.md) (hot paths) and [`plans/C21-profiling-scrutiny.md`](../plans/C21-profiling-scrutiny.md) (surfaces S1–S10; automated CPU profiling is **deferred** until real evidence).

## What not to use as a chart FPS gate

**Lighthouse** (demo or otherwise) does **not** drive the scrubber and its Performance score is **not** RRG smoothness. Use Layer B + manual Performance panel for chart claims. Lighthouse may still be useful later as optional **demo page** health — that is not a substitute for `npm run test:perf`.

## Production / host notes

- Prefer capped `tailLength` product mode; treat full-history as a different cost class.  
- After host dogfood on real series, log issues in `plans/C19-dogfood-notes.md` (or C10 notes). Automated CDP CPU capture ([C21](../plans/C21-deep-profiling.md)) stays deferred until something concrete needs attribution.
