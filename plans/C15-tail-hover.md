# C15: Tail Hit-Target Hover

**Phase:** Interaction / Polish  
**Estimate:** 1–2 days  
**Depends on:** [C14](./C14-public-release.md) complete (or explicitly parallelizable after C13 if C14 is packaging-only)  
**Suggested schedule:** After C14 public-release hygiene  
**Priority:** Standard — improves discoverability when points are dense or tails are long  
**Status:** Complete (implementation + unit tests)

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

- [x] Spike: mount chart with `longPlayback100` / `longPlayback500`; confirm hit strokes do not tank scrub FPS in demo
- [x] Decide conflict rule: **point-wins** vs **closest-segment** vs **paint-order**
- [x] Decide whether tail hover emits the same `pointHover` payload (current frame) — **recommended yes**
- [x] Confirm `highlightedTicker` / `selectedTicker` still compose correctly with tail-driven hover

### Decisions (locked)

| Topic | Decision |
|-------|----------|
| Conflict rule | **Point-wins** — points stay painted above tails; when both under cursor, the point hit circle receives the event |
| Crossing tails | **Paint-order** among tails (hovered ticker raised via existing `orderedTails`); no closest-segment picker in v1 |
| Event payload | Tail enter maps to the ticker’s **current-frame** `RrgRenderPoint` and uses the same `pointHover` / `pointLeave` emits |
| Hit geometry | Invisible per-segment `<line>` hits, `stroke-width` 12, `pointer-events: stroke`; leave guards via `relatedTarget` (same-tail segment moves + handoff to point hits) |
| a11y | Unchanged — keyboard/`role="button"` stay on points only |
| Perf | Hit lines ≈ visible segment count (e.g. 8×499 ≈ 4k for `longPlayback500`). Unit mounts of `longPlayback100`/`500` pass with hits present. No FPS ceiling found in automated tests; if scrub feels heavy in demo, defer hit LOD to [C16](./C16-optimization.md) |

---

## Implementation sketch

```
RrgTails.vue
  + hit <line> per segment, pointer-events: stroke
  + emit tailEnter(ticker) / tailLeave
RrgChart.vue
  + map ticker → currentPoints entry → onPointEnter / onPointLeave
tests/
  + RrgChart.tailHover.test.ts — enter segment → tooltip + data-hovered-ticker
demo/
  + no new toggle (always on)
```

Optional follow-up (out of scope unless cheap): `tailHitWidth` public prop.

---

## Unit Tests

- [x] Hovering a tail segment sets effective hover for that ticker
- [x] Leaving the tail (and not entering another hit) clears hover
- [x] Overlapping point hit circle still wins when both under cursor (point-wins / DOM order + handoff)
- [x] Events: `pointHover` / `pointLeave` parity with point-driven hover
- [x] Regression: long playback fixture still mounts without throw

---

## Out of Scope

- Click-to-lock / solo isolate mode  
- Changing tooltip to show historical segment date (v1 stays current frame)  
- Canvas / WebGL hit testing  

---

## Acceptance Criteria

- [x] Investigation decisions recorded (conflict rule + event payload)  
- [x] Tail hover works in demo for default + long-playback scenarios (always-on; covered by unit mounts)  
- [x] Unit tests green; SFCs within size limits  
- [x] Perf note: ~4k hit lines at `longPlayback500`; no automated ceiling; LOD → C16 if demo scrub regresses  

---

## Cross-refs

- Hover / tooltip: [C7](./C7-hover-events.md)  
- Long playback fixtures: [C13](./C13-demo-playground.md) (`longPlayback50`…`500`)  
- Order: C14 → C15 → [C16](./C16-optimization.md) → C10 (deferred)
