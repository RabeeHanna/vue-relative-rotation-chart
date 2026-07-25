# C15: Tail Hit-Target Hover

**Phase:** Interaction / Polish  
**Estimate:** 1–2 days  
**Depends on:** [C14](./C14-public-release.md) complete (or explicitly parallelizable after C13 if C14 is packaging-only)  
**Suggested schedule:** After C14 public-release hygiene  
**Priority:** Standard — improves discoverability when points are dense or tails are long  
**Status:** Planned (investigation + implementation)

---

## Goal

Allow pointer hover (and matching tooltip / fade emphasis) when the cursor is over a **tail segment**, not only the current-frame point hit circle. Investigate edge cases first, then implement with tests and demo coverage.

---

## Background (C13 investigation)

Today only `RrgPoints` transparent hit circles (`hitRadius`, default 12) drive hover. `RrgTails` strokes are ~1.75px with no pointer handlers and sit **under** points.

**Recommended approach (from C13):**

1. Invisible wide hit strokes on each segment (`stroke-width` ~10–14, transparent fill/stroke-opacity, `pointer-events: stroke`)
2. On enter → set hover to that ticker’s **current-frame** point (tooltip stays frame-correct)
3. Keep points above tails so heads still win when both overlap
4. Avoid segment↔segment leave flicker via group-level handlers or `relatedTarget` checks

**Open risks to resolve in this unit:**

| Risk | Mitigation options |
|------|--------------------|
| Crossing tails | Z-order (last painted / hovered on top) or closest-segment pick |
| Dense clusters | Prefer point hit when within `hitRadius`; document remaining ambiguity |
| Performance | Long tails (100–500 pts) × many tickers — measure with C13 long-playback fixtures; consider hit-path LOD or thinner history window for hits only |
| a11y | Keyboard / `role="button"` remain on points; tails are pointer convenience only |

---

## Investigation checklist (do first)

- [ ] Spike: mount chart with `longPlayback100` / `longPlayback500`; confirm hit strokes do not tank scrub FPS in demo
- [ ] Decide conflict rule: **point-wins** vs **closest-segment** vs **paint-order**
- [ ] Decide whether tail hover emits the same `pointHover` payload (current frame) — **recommended yes**
- [ ] Confirm `highlightedTicker` / `selectedTicker` still compose correctly with tail-driven hover

Record decisions in this file before merging implementation.

---

## Implementation sketch

```
RrgTails.vue
  + optional hit <line> (or path) per segment, pointer-events: stroke
  + emit tailEnter(ticker) / tailLeave
RrgChart.vue
  + map ticker → currentPoints entry → onPointEnter / onPointLeave
tests/
  + RrgChart.tailHover.test.ts — enter segment → tooltip + data-hovered-ticker
demo/
  + no new toggle required (behavior always on once shipped)
```

Optional follow-up (out of scope unless cheap): `tailHitWidth` public prop.

---

## Unit Tests

- Hovering a tail segment sets effective hover for that ticker
- Leaving the tail (and not entering another hit) clears hover
- Overlapping point hit circle still wins when both under cursor (if point-wins)
- Events: `pointHover` / `pointLeave` parity with point-driven hover
- Regression: long playback fixture still mounts without throw

---

## Out of Scope

- Click-to-lock / solo isolate mode  
- Changing tooltip to show historical segment date (v1 stays current frame)  
- Canvas / WebGL hit testing  

---

## Acceptance Criteria

- [ ] Investigation decisions recorded (conflict rule + event payload)  
- [ ] Tail hover works in demo for default + long-playback scenarios  
- [ ] Unit tests green; SFCs within size limits  
- [ ] Perf note: any ceiling found with 200/500-point fixtures documented here or in overview  

---

## Cross-refs

- Hover / tooltip: [C7](./C7-hover-events.md)  
- Long playback fixtures: [C13](./C13-demo-playground.md) (`longPlayback50`…`500`)  
- Order: C14 → C15 → [C16](./C16-optimization.md) → C10 (deferred)
