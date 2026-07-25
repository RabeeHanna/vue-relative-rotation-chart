# PRE-C1-B: Fit Mode Outlier Strategy Decision

**Phase:** Pre-Start Prerequisites  
**Estimate:** 0.5 day  
**Must complete before:** C8 (Viewport Modes)  
**Priority:** Medium — must be decided before viewport code is written  
**Status:** Complete — 2026-07-25

---

## Goal

Choose and document a concrete strategy for how the `fit` viewport mode handles outlier tickers. This is a design decision, not a code task. The decision is recorded here and implemented in C8.

---

## Why This Needs a Decision Now

The `fit` viewport mode defaults to focusing on visible current points with padding. Without a defined outlier strategy, there is a common failure mode:

> One ticker positioned far from the cluster (e.g. x=150, y=50 while the rest cluster near 100/100) causes the axis scale to expand dramatically, compressing the useful cluster into a tiny region of the chart.

This must be decided before C8 so the implementation has a clear spec. The original PRD favored avoiding that crush; after review we chose transparency over cluster-protection for v1 (see decision below).

---

## The Options Considered

### Option A: Percentile-Based Clipping

- Domain = 5th–95th percentile of visible x/y (+ padding)
- Outliers render off-chart in `fit`; visible in `max`

### Option B: Fixed Cap

- Fixed ranges (e.g. 85–115) regardless of data
- Predictable but ignores actual distribution

### Option C: Hybrid — Fit Cluster with Outlier Indicator

- Clip cluster + edge badges for off-chart tickers
- Best UX, more C8 scope

### Option D: Fit-All (data extent, no clipping) — SELECTED

- Domain = min/max of visible current points **and** their tail slices, plus padding
- No percentile clipping, no fixed cap
- Domain is recomputed from props whenever series / `selectedDate` / `tailLength` change
- One far outlier *will* expand the viewport and compress the cluster — accepted for v1
- Users who want a tighter fixed window use `center`; full history uses `max`

---

## Decision Record (COMPLETED)

```
Fit Mode Outlier Strategy
==========================
Strategy selected: [ ] Percentile-Based  [ ] Fixed Cap  [ ] Hybrid  [x] Other: Fit-All (no clipping)

If Other / Fit-All:
  - Domain source: extent of visible series at selectedDate, including tailLength
    points leading into that date
  - Padding added beyond data extent: 5 units (default; configurable as fitPadding)
  - Outlier clipping: none
  - Domain stability: round bounds to nearest 0.5 unit to reduce replay jitter

Acceptance scenario verification (updated for Fit-All):
  - 15 tickers near 100/100 + one at 150/50: [PASS expected] outlier remains
    on-chart; cluster is smaller — accepted tradeoff
  - All tickers clustered: [PASS expected] viewport fits tightly with padding
  - Single ticker only: [PASS expected] padding around the single point; fall
    back to center domain only if no visible points

Decision rationale:
  Series data is already provided to the component, so the correct "cap" is
  derived from that data (min/max + padding), not a hardcoded or percentile
  window. Fit should mean fit everything currently in view. Protecting the
  cluster by hiding outliers is deferred; use center for a fixed window and
  max for full-history extent.
```

**C8 must implement Fit-All** — see [`C8-viewport.md`](./C8-viewport.md). Cross-refs also updated in [`00-overview.md`](./00-overview.md) and [`C11-adversarial-review.md`](./C11-adversarial-review.md).

---

## Acceptance Criteria

- [x] One strategy is chosen and documented above
- [x] Acceptance scenarios updated for Fit-All (outlier stays visible; cluster may compress)
- [x] Outlier is visible in `fit` (on-chart); `max` still differs by covering all dates
- [x] Decision is referenced in C8 implementation spec
- [ ] Axis readability with outliers present — verified when C8 is implemented
