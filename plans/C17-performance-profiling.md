# C17: Performance Testing & Profiling

**Phase:** Performance / Quality  
**Estimate:** 2–4 days (harness + matrix + first results)  
**Depends on:** [C16](./C16-optimization.md) complete; C13 long-playback fixtures; demo `fullHistoryTail`  
**Suggested schedule:** After C16 follow-ups; before further LOD work; independent of deferred [C10](./C10-sector-orbit-integration.md)  
**Priority:** High for confidence; blocks informed optimization follow-ups  
**Status:** Complete (Layer A on PR CI; Layer B nightly/manual; first local baseline in [C17-results.md](./C17-results.md))

---

## Goal

Build a **repeatable performance testing and profiling story** across likely RRG chart use cases, and record **append-only** baselines so future optimizations are evidence-driven.

**Scrutiny / research:** [C17-research.md](./C17-research.md)  
**Results log:** [C17-results.md](./C17-results.md)

---

## What shipped

1. **Layer A (every PR via `npm test`)** — `tests/perf/nodeCounts.test.ts` (hard), `datePatch.test.ts` (soft JSDOM), helpers, `packageExclusion.test.ts`  
2. **Layer B** — Playwright FPS in `tests/perf/fps.p0-p2.spec.ts` + `playwright.perf.config.ts`; `npm run test:perf`; soft ≥55 for P0/P2 scrub+play; `PERF_HARD_GATE=1` optional; `PERF_CEILING=1` for D3  
3. **Nightly** — `.github/workflows/perf-nightly.yml` (schedule + `workflow_dispatch`, uploads artifacts)  
4. **Demo convenience** — `DemoPerfPanel.vue` / `demoPerfSample.ts` (not source of truth)  
5. **Append-only results** — first local baseline in `plans/C17-results.md`

---

## Locked decisions

See [C17-research.md § Locked decisions](./C17-research.md#locked-decisions). Summary: no FPS hard-fail on PR; node-counts hard; P0/P2 must-pass soft ≥55 scrub+play; Playwright-first; Chromium-only; append-only results; revisit profiles after C10.

---

## Acceptance criteria

- [x] Scrutiny decisions locked  
- [x] Layer A Vitest: hard node-count invariants on every PR  
- [x] Layer A: soft N-step date-patch timings (labeled non-FPS)  
- [x] Layer B Playwright sampler for P0/P2 scrub **and** play  
- [x] ≥55 fps soft bar (artifacts; not PR hard-fail)  
- [x] Cadence: Layer A on PR; Layer B nightly + manual; FPS matrix not on every PR  
- [x] Full-history path measurable (D3-ceiling when `PERF_CEILING=1`; node-count LP100 full history in Vitest)  
- [x] T=100-style ceiling via nightly `PERF_CEILING` (LP100 full-history scrub)  
- [x] Append-only `plans/C17-results.md`  
- [x] Package/`files` exclusion test  
- [x] Checklist: revisit P0–P3 after C10  
- [x] Overview status updated  

---

## Commands

| Command | When |
|---------|------|
| `npm test` | Every PR — includes Layer A |
| `npm run test:perf` | Nightly / manual / before hot-path releases |
| `PERF_CEILING=1 npm run test:perf` | Nightly ceiling probe |
| `PERF_HARD_GATE=1 npm run test:perf` | Local only if you want hard FPS fail |

---

## Follow-ups

- Hit LOD / simplify if documented full-history numbers warrant it  
- Date→index map if profiles show find cost  
- Revisit must-pass profiles after C10  
- **Next:** [C18](./C18-pre-npm-polish.md) pre-npm polish → then [C10](./C10-sector-orbit-integration.md)  

---

## Cross-refs

- Research: [C17-research.md](./C17-research.md)  
- Prior: [C16-optimization.md](./C16-optimization.md)  
- Order: C16 → **C17** → [C18](./C18-pre-npm-polish.md) → C10 (then profile revisit)
