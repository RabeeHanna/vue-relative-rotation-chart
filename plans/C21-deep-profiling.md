# C21: Deep Profiling (Deferred)

**Phase:** Performance / Quality  
**Estimate:** 2–4 days **if unlocked** (harness + docs deltas + first baselines)  
**Depends on:** [C17](./C17-performance-profiling.md); decisions in [C21-profiling-scrutiny.md](./C21-profiling-scrutiny.md); **evidence gate (O8)** — do not start otherwise  
**Suggested schedule:** **After** C19 real-data dogfood (and/or a recorded C17 regression). **Not** parallel to C19.5 / first npm. **Not** a publish blocker.  
**Priority:** Low until evidence; High once attribution is needed  
**Status:** Draft — **deferred** pending evidence gate  

---

## Goal

When (and only when) there is a concrete perf problem to attribute, add CDP CPU profiling (± optional harness/demo User Timing) on top of C17 so developers can answer **where time goes** — without hard CI CPU gates or polluting the npm package.

**Not in scope until unlocked:** building this “just in case”; Lighthouse; bundle-size (see [C20](./C20-bundle-size-perf-playbook.md)); memory snapshots; `src/` performance marks; scheduled nightly CPU jobs; optimization product work (LOD/Canvas).

---

## Scrutiny

Locked decisions O1–O9 and evidence gate:  
→ [C21-profiling-scrutiny.md](./C21-profiling-scrutiny.md)

Taxonomy (S1–S10) and tool-fit tables stay valid reference **without** implementing Layer C/D.

---

## Evidence gate (must pass before implementation)

At least one of:

1. Dated entry in [`C17-results.md`](./C17-results.md) (or equivalent) showing an FPS soft-fail / regression that needs attribution, **or**  
2. Host real-data dogfood notes ([C19](./C19-first-public-publish.md) / C10) describing a **concrete** chart perf issue (jank, long frames, host complaint).

Synthetic-only package profiles do **not** unlock this unit.

---

## Workstreams (only after gate)

### A — Layer C (workflow_dispatch)

1. Reuse C17 drivers; CDP CPU profile for agreed profiles (at least P2 scrub+play).  
2. `.cpuprofile` + summary JSON under `test-results/perf/` (gitignored); CI upload on **dispatch only**.  
3. No scheduled nightly until the harness has caught something real once (O3).  
4. Artifacts only — no numeric profile budgets in v1 (O4).

### B — Layer D (optional)

1. Harness/demo User Timing injection only (O1).  
2. No `src/` marks on the default publish path.

### C — Results / docs delta

1. Append-only `plans/C21-profile-results.md` (or `C21-results/`).  
2. Extend `docs/perf.md` (from C20) with “how to open the captured `.cpuprofile`.”  
3. Overview status → complete when shipped.

---

## Acceptance criteria (when unlocked)

- [ ] Evidence gate documented (link to C17-results entry and/or dogfood notes)  
- [ ] Layer C on `workflow_dispatch`; profiles + summaries produced  
- [ ] No default PR hard-fail on CPU; no scheduled nightly unless promoted post-hit  
- [ ] No Lighthouse in this unit; no bundle-size work (already C20)  
- [ ] No always-on marks in published `dist`  
- [ ] C17 Layer A/B preserved as smoothness source of truth  
- [ ] First append-only C21 results entry  
- [ ] Tests for any new summary helpers; suite green  

---

## Out of scope

- Premature harness before O8  
- Demo Lighthouse  
- Bundle size (C20)  
- Manual playbook initial ship (C20) — only extend after Layer C exists  
- Host `master` merge  

---

## Suggested files (when unlocked)

| Area | Likely touch |
|------|----------------|
| Harness | `tests/perf/*` |
| CI | dispatch job (extend or sibling of perf workflow) |
| Docs | `docs/perf.md` extension |
| Results | `plans/C21-profile-results.md` |
| Overview | `plans/00-overview.md` |

---

## Cross-refs

- Scrutiny: [C21-profiling-scrutiny.md](./C21-profiling-scrutiny.md)  
- Ship-now: [C20-bundle-size-perf-playbook.md](./C20-bundle-size-perf-playbook.md)  
- C17: [C17-research.md](./C17-research.md)  

---

## Revision log

| Date | Note |
|------|------|
| 2026-07-25 | Drafted as C20; review deferred automation |
| 2026-07-25 | Renumbered C21; status deferred pending evidence gate; C20 split for bundle + playbook |
