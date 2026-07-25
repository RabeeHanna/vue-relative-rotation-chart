# C16: Render / Playback Optimization

**Phase:** Performance  
**Estimate:** 2–4 days (spike + implement)  
**Depends on:** [C13](./C13-demo-playground.md) long-playback fixtures; preferably after [C15](./C15-tail-hover.md) if hit-target work lands first  
**Suggested schedule:** After C15 (or parallel spike after C14 if C15 slips)  
**Priority:** Standard once long histories (100–500 pts) or dense tickers show real lag  
**Status:** Planned

---

## Goal

Investigate and implement optimizations so long RRG histories and dense ticker sets stay interactive during scrub/play — without changing the public renderer-only contract (still no RRG calculation).

Likely one combined unit; split into C16a (investigate + decisions) / C16b (implement) only if the spike surfaces multiple large approaches.

---

## Problem Space (from C13 probes)

With `tailLength` capped (e.g. 10), **tail segment math stays cheap** even at 500 points/ticker — history length mostly inflates:

- Playback `dates[]` size and scrubber updates  
- Per-frame Vue reactivity (points, labels, domain, tooltip)  
- Full rebuild of tail `<line>` lists when `selectedDate` changes  
- Future C15: wide invisible hit strokes × many segments  

So optimization is less “D3 path math” and more **work avoidance / approximation under load**.

---

## Investigation tracks

### 1. Tail / trail approximation

| Idea | Intent | Risks |
|------|--------|-------|
| Decimate older tail samples | Fewer SVG nodes for long visible tails | Shape fidelity; document when approx kicks in |
| Adaptive `tailLength` under stress | Cap work automatically | Surprising UX vs explicit prop |
| Single path + gradient vs N `<line>`s | Fewer DOM nodes | Harder per-segment opacity / hit targets |

### 2. Avoid full redraw each frame

| Idea | Intent | Risks |
|------|--------|-------|
| Dirty only changed series | Skip untouched tickers | Hover/highlight still need siblings |
| Reuse path strings / keyed segments | Cut Vue patch cost | Complexity vs gain |
| Throttle chart updates while scrubbing | Smooth slider, fewer frames | Feels laggy if overdone (C12 noted this) |

### 3. Playback / data-plane

| Idea | Intent | Risks |
|------|--------|-------|
| Virtualize or subsample scrubber ticks | Large `dates` lists | Precision of frame label |
| Prefetch next-frame slices | Lower per-tick work | Memory |
| Document skip vs interval modes (already in C13) | Caller chooses fidelity vs speed | Not a render opt alone |

### 4. Measurement harness

Reuse `longPlayback50/100/200/500` + Vitest/browser timings. Record:

- Tail recompute ms  
- Mount + N scrub steps ms  
- DOM node counts (segments × tickers)  
- FPS while playing (manual / Playwright)

---

## Locked decisions to make in this unit

1. **Approximation trigger** — always-on vs only when `points > N` or `tickers × tailLength > M`  
2. **Public API** — new props (e.g. `tailSimplify`, `maxTailSegments`) vs internal heuristics only  
3. **Fidelity promise** — exact at default settings; approx only when opted in  
4. **Whether to split** C16 into investigate-only then implement

---

## Out of Scope

- Canvas / WebGL renderer  
- RRG calculation or data fetching  
- Sector Orbit caching  
- Changing Fit-All / viewport math unless proven hot  

---

## Acceptance Criteria

- [ ] Spike notes + chosen approach recorded in this file  
- [ ] At least one optimization lands with before/after numbers on `longPlayback200` or `500`  
- [ ] Defaults remain visually identical for short demos (`default`, ≤30 pts)  
- [ ] Unit tests cover new helpers; existing chart tests stay green  
- [ ] Overview / AGENTS updated if new modules appear  

---

## Cross-refs

- Long fixtures: [C13](./C13-demo-playground.md)  
- Tail hover cost: [C15](./C15-tail-hover.md)  
- Existing smoke: `tests/tail.performance.test.ts`, `tests/demo.longPlayback.test.ts`  
- Order: C14 → C15 → **C16** → C10 (deferred)
