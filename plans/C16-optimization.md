# C16: Render / Playback Optimization

**Phase:** Performance  
**Estimate:** 2–4 days (spike + implement)  
**Depends on:** [C13](./C13-demo-playground.md) long-playback fixtures; preferably after [C15](./C15-tail-hover.md) if hit-target work lands first  
**Suggested schedule:** After C15 (or parallel spike after C14 if C15 slips)  
**Priority:** Standard once long histories (100–500 pts) or dense tickers show real lag  
**Status:** Complete (stable keys + CX scrub coalesce; full-history LOD deferred)

---

## Goal

Investigate and implement optimizations so long RRG histories and dense ticker sets stay interactive during scrub/play — without changing the public renderer-only contract (still no RRG calculation).

**Scrutiny / research:** [C16-research.md](./C16-research.md)

---

## Locked product decisions

| Topic | Decision |
|-------|----------|
| Default product mode | **Capped `tailLength` (~8–15)** — primary optimization target |
| Full history | Nice-to-have later: **opt-in toggle, off by default** (demo/testing); not required for C16 acceptance |
| Scrub (from Unit CX) | Handle live; chart `selectedDate` **rAF-coalesced** |
| Approximation / path merge / hit LOD | **Deferred** until full-history toggle work (or measured need) |

---

## What shipped

1. **Stable Vue keys** for tail hit + visible segments (`ticker` + index) — avoids remounting sliding-window lines on every date change (`RrgTails.vue` + `RrgChart.tails.test.ts`)
2. **CX §9 scrub coalesce** — `createScrubCoalesce` + `useScrubDatePreview`: local preview keeps scrubber/labels live; chart date emits ≤1/rAF (`RrgPlaybackControls`)

---

## Acceptance Criteria

- [x] Spike notes + chosen approach recorded ([C16-research.md](./C16-research.md))  
- [x] Optimizations land with tests (stable-key DOM identity; scrub coalesce latest-index)  
- [x] Defaults remain visually identical for short demos  
- [x] Unit tests cover new helpers; existing chart/playback tests stay green  
- [x] Overview updated  

---

## Follow-ups (not C16)

- ~~Demo **full-history tail** toggle (off by default)~~ — **done** (`fullHistoryTail` in demo controls / URL / session)
- ~~Public **`copy` prop** + demo Copy / labels panel~~ — **done** (`RrgChartCopy` / `RrgPlaybackCopy`; session-persisted overrides)
- Optional `maxTailSegments` / simplify if full-history node counts hurt  
- Hit LOD if full-history mode proves heavy in the browser  
- **Next draft:** performance testing / profiling unit under likely use cases (browser FPS + harness)

---

## Cross-refs

- Research: [C16-research.md](./C16-research.md)  
- Playback CX / C12: [C12-playback-controls.md](./C12-playback-controls.md)  
- Tail hover: [C15-tail-hover.md](./C15-tail-hover.md)  
- Order: C14 → C15 → **C16** → C10 (deferred)
