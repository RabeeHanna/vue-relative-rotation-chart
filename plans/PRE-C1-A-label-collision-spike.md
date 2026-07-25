# PRE-C1-A: Label Collision Algorithm Spike

**Phase:** Pre-Start Prerequisites  
**Estimate:** 1 day  
**Must complete before:** C1 (Component Project Skeleton)  
**Priority:** Critical — this is the make-or-break technical piece of the entire project

---

## Goal

Prove that a label placement algorithm can handle the worst-case RRG scenario — many tickers clustered near 100/100 — before any component code is written. Select and document a concrete algorithm that will be implemented in Unit C6.

This unit is explicitly a spike/prototype. No production code should be committed as part of this unit.

---

## Why This Must Come First

The primary reason this component exists is readable ticker labels in dense clusters. Unreadable label clusters are the main pain point with the ECharts renderer. The collision algorithm is the highest-risk technical piece, yet it is easy to underestimate.

The risk pattern to avoid:
1. Build axes, points, and tails successfully (C1–C5)
2. Discover in week 3 that the chosen label placement strategy doesn't work in real data
3. Rearchitect the label system retroactively

This spike eliminates that risk before investment begins.

---

## What to Build

A standalone prototype (separate file or throwaway script) that:

1. Takes worst-case mock data (see below) as input
2. Runs 2–3 placement algorithms
3. Renders labels visually so you can see which algorithm works
4. Produces a documented decision

The prototype does **not** need to be Vue components, TypeScript, or production quality. A plain HTML/SVG file or a Vitest test with SVG output inspection is sufficient.

---

## Worst-Case Mock Dataset

Create a dataset with the following properties:

- **15–20 tickers** all positioned within ±5 units of x=100, y=100
- **Varied label lengths**: mix of short (XLK, XLF) and long (XLRE, XLNX, SMCAP)
- **Some exactly overlapping** x/y positions (within 1–2 units)
- **Some radially distributed** around 100/100 at 2–5 unit radius
- **A few outliers** at 90/110, 110/90, etc. to test the non-clustered case too

Example minimal set:
```ts
[
  { ticker: 'XLK',  x: 102.1, y: 101.3 },
  { ticker: 'XLF',  x: 101.8, y: 100.5 },
  { ticker: 'XLC',  x: 100.9, y: 101.8 },
  { ticker: 'XLRE', x: 99.7,  y: 100.2 },
  { ticker: 'XLI',  x: 101.5, y: 99.4  },
  { ticker: 'XLB',  x: 100.2, y: 98.9  },
  { ticker: 'XLV',  x: 102.5, y: 100.8 },
  { ticker: 'XLU',  x: 99.1,  y: 101.1 },
  { ticker: 'XLE',  x: 100.5, y: 102.3 },
  { ticker: 'XLP',  x: 101.0, y: 100.0 },
  { ticker: 'XLY',  x: 100.3, y: 99.7  },
  { ticker: 'SMH',  x: 98.8,  y: 100.4 },
  { ticker: 'IWM',  x: 101.2, y: 101.9 },
  { ticker: 'QQQ',  x: 102.8, y: 101.0 },
  { ticker: 'SPY',  x: 99.5,  y: 99.2  },
]
```

---

## Algorithms to Test

Test all three. Document findings for each.

### Algorithm 1: Greedy Offset Candidate Search

**How it works:**
1. For each point (sorted by some priority — e.g. label length ascending), try offset positions in a fixed candidate list around the point
2. Candidate offsets (in SVG pixels, relative to point center): right, upper-right, upper, upper-left, left, lower-left, lower, lower-right
3. For each candidate, check if the proposed label bounding box overlaps any already-placed label
4. Place at the first clean candidate
5. If no candidate is clean, hide the label (in `auto` mode)

**Parameters to tune:**
- `offsetDistance`: starting distance from point to label anchor (e.g. 8px)
- `labelWidth`: estimated width (can use character count × avg char width)
- `labelHeight`: fixed (e.g. 12px for a standard font size)
- `collisionPadding`: extra padding around each label's bounding box

**Pros:** Fast, simple, deterministic  
**Cons:** Greedy order matters; later-placed labels get worse positions

### Algorithm 2: Force-Directed Layout

**How it works:**
1. Initialise label positions at their preferred offset from the point
2. Run a force simulation: labels repel each other and repel their anchor points
3. Labels are attracted back toward their preferred anchor offset
4. Stop after N iterations or when forces fall below threshold

**Parameters to tune:**
- Repulsion strength between labels
- Attraction strength toward anchor
- Maximum displacement from anchor
- Iteration count / convergence threshold

**Pros:** Produces good results in dense cases; handles arbitrary density  
**Cons:** Non-deterministic without fixed seed; slower; harder to debug

### Algorithm 3: Spatial Binning (Hybrid)

**How it works:**
1. Divide the chart area into a grid of bins
2. Assign each label to the bin that its preferred offset position falls into
3. If a bin is already occupied, try adjacent bins in order of preference
4. Fall back to hiding if no adjacent bin is clean

**Parameters to tune:**
- Bin size (e.g. 20×14px, matching typical label dimensions)
- Priority order for adjacent bins

**Pros:** Very fast; naturally avoids overlaps by bin exclusion  
**Cons:** Coarser placement; labels snap to grid rather than floating freely

---

## Acceptance Criteria for the Spike

The spike is complete when:

- [ ] All three algorithms are prototyped and visually tested against the worst-case mock
- [ ] Clustered mock chart (15+ tickers near 100/100) produces visually separated labels with the winning algorithm
- [ ] No label fusing (two labels occupying the same visual space) occurs in the winning algorithm
- [ ] Placement is deterministic: re-running the algorithm on the same data always produces the same layout
- [ ] Label placement is stable during simulated date replay (positions don't jump every frame)
- [ ] A clear winner is documented with rationale (see Documentation section below)

---

## Documentation to Produce

After the spike, record the following decisions **before starting C1**:

```
Label Collision Algorithm Decision
===================================
Algorithm Selected: [ ] Greedy Offset  [ ] Force-Directed  [ ] Spatial Bin  [ ] Other: ___

Rationale: why this algorithm over the others for this specific use case

Concrete placement rules:
  - offsetDistance: ___ px (starting offset from point center to label anchor)
  - labelPadding: ___ px (extra padding around label bounding box for collision check)
  - candidateOrder: (list the offset directions tried, in priority order)
  - hideThreshold: (condition under which label is hidden in auto mode)
  - placementDeterminism: (how ordering is fixed to ensure stable results)

Worst-case result:
  - Max tickers tested: ___
  - % of labels placed cleanly: ___
  - % hidden (no clean slot): ___
  - Visual assessment: ___

Screenshots: (attach before/after images)
```

This document will be referenced in C6 (Label Collision System) as the implementation spec.

---

## Notes and Constraints

- **Do not over-engineer.** This is a prototype to validate an approach, not production code.
- Greedy offset is the recommended starting point for its simplicity and determinism. Only escalate to force-directed if greedy provably fails on the worst-case data.
- The algorithm must be **deterministic**. Force-directed approaches require a fixed seed or a separate post-processing stabilization pass.
- Label placement accuracy matters more than label completeness. It is acceptable to hide 20–30% of labels in extremely dense cases, as long as hidden labels are always revealed on hover.
- Performance of the placement algorithm itself matters: it must complete in < 5ms for 50 tickers to not block renders.
