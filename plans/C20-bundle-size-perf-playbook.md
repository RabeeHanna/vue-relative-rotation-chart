# C20: Bundle Size Tracking + Perf Playbook

**Phase:** Packaging / Trust · Performance hygiene  
**Estimate:** 0.5–1 day  
**Depends on:** [C14](./C14-public-release.md) / [C17](./C17-performance-profiling.md) exist; split out from [C21 scrutiny](./C21-profiling-scrutiny.md) (O6, O9)  
**Suggested schedule:** **Now** — independent of C19 publish polish and of deferred C21 profiling  
**Priority:** High (cheap, deterministic; publish-adjacent)  
**Status:** Complete  

---

## Goal

Ship two free wins that do **not** require observed FPS regressions or host dogfood:

1. **Bundle-size tracking** with a soft warn (dist JS/CSS and/or pack size) so ship cost does not drift unnoticed.  
2. **Manual perf playbook** (`docs/perf.md` + CONTRIBUTING link): what to do when C17 FPS soft-fails or the chart feels janky — DevTools steps mapped to the C17 hot-path table.

**Not in scope:** CDP CPU automation; Lighthouse; User Timing in `src/`; memory snapshots; changing C17 gates. Those stay in deferred [C21](./C21-deep-profiling.md) or elsewhere.

---

## Why this unit (not C21)

Review locked O6/O9: bundle size and the manual playbook are useful **regardless** of whether automated attribution is ever built. They must not wait on the C21 evidence gate.

---

## Workstreams

### A — Bundle size

1. Record baseline sizes for published artifacts (e.g. `dist/vue-relative-rotation-chart.js`, CSS, optional `npm pack` unpacked/tarball size).  
2. Add a Vitest or script check with **soft** threshold (warn / document) — avoid flaky hard PR fails unless sizes are trivially stable. Prefer asserting “files exist + size &lt; generous ceiling” or append-only log + soft compare.  
3. Optional: note in C19 publish checklist that bundle size is tracked (restore Bundlephobia badge remains C19 publish step).  
4. Keep harness out of `"files": ["dist"]`.

### B — Playbook

1. Add `docs/perf.md`:  
   - C17 commands (`npm test` Layer A, `npm run test:perf` Layer B)  
   - Soft ≥55 meaning; where results live (`plans/C17-results.md`)  
   - Manual Chrome Performance steps on demo URL for P0/P2  
   - Map symptoms → likely files (point at C17 hot-path table / C21 scrutiny architecture)  
   - Explicit: Lighthouse ≠ chart FPS  
2. Link from `CONTRIBUTING.md`.  
3. Touch `tests/perf/AGENTS.md` if useful (point to playbook).

### C — Hygiene

- Unit tests for any size-helper / ceiling logic.  
- Overview checkmarks when done.

---

## Acceptance criteria

- [x] Bundle size tracked with soft warn / documented baseline  
- [x] `docs/perf.md` playbook shipped; CONTRIBUTING links to it  
- [x] No Layer C/D automation introduced  
- [x] Vitest green for new helpers; packaging still `files: ["dist"]` only  
- [x] Overview / plan status updated  

---

## Out of scope

- C21 CPU profiles  
- Demo Lighthouse (optional C19/C19.5 checklist only)  
- npm publish / badge restore (C19)  

---

## Suggested files

| Area | Likely touch |
|------|----------------|
| Tests / scripts | `tests/perf/bundleSize.ts`, `bundleSize.test.ts`; `npm run check:bundle-size` |
| Docs | `docs/perf.md`, `docs/AGENTS.md`, `CONTRIBUTING.md`, `tests/perf/AGENTS.md` |
| CI | `.github/workflows/ci.yml` after `build` |
| Plans | this file; `plans/00-overview.md` |

---

## Cross-refs

- Split from: [C21-profiling-scrutiny.md](./C21-profiling-scrutiny.md)  
- FPS: [C17-research.md](./C17-research.md)  
- Publish: [C19-first-public-publish.md](./C19-first-public-publish.md)  

---

## Revision log

| Date | Note |
|------|------|
| 2026-07-25 | Created from C21 review: O6 + O9 ship-now split; profiling renumbered to C21 |
| 2026-07-25 | Implemented: bundle ceilings + soft warn, `docs/perf.md`, CI post-build check |
