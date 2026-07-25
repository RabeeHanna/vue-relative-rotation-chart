# PRE-C1-B: Fit Mode Outlier Strategy Decision

**Phase:** Pre-Start Prerequisites  
**Estimate:** 0.5 day  
**Must complete before:** C8 (Viewport Modes)  
**Priority:** Medium — must be decided before viewport code is written

---

## Goal

Choose and document a concrete strategy for how the `fit` viewport mode handles outlier tickers. This is a design decision, not a code task. The decision is recorded here and implemented in C8.

---

## Why This Needs a Decision Now

The `fit` viewport mode defaults to focusing on visible current points with padding. Without a defined outlier strategy, there is a common failure mode:

> One ticker positioned far from the cluster (e.g. x=150, y=50 while the rest cluster near 100/100) causes the axis scale to expand dramatically, compressing the useful cluster into a tiny region of the chart.

This makes the chart unreadable for normal use cases. The PRD says fit mode should "avoid one outlier crushing the useful cluster where possible" but does not specify how.

This must be decided before C8 so the implementation has a clear spec.

---

## The Three Options

### Option A: Percentile-Based Clipping

**How it works:**
- Calculate the 5th–95th percentile range of all visible x positions and all visible y positions
- Use those percentile bounds (plus padding) as the viewport domain
- Tickers outside the clipped range are simply not visible in fit mode (they render outside the SVG viewport)

**Pros:**
- Adapts to data density; always shows the main cluster well
- No hardcoded magic numbers
- Statistically principled

**Cons:**
- Tickers outside range disappear silently — user may not know an outlier exists
- Percentile calculation changes as tickers are added/removed
- May clip legitimate extreme values in small universes (e.g. 5 tickers, the 5th percentile is the lowest value)

**Acceptance scenario:**
- 15 tickers near 100/100, one at 150/50 → viewport shows 100/100 cluster clearly; outlier is off-chart
- User must be able to switch to `max` mode to see outlier

### Option B: Fixed Cap

**How it works:**
- x-axis is capped at a fixed range (e.g. 85–115 in fit mode, regardless of data)
- y-axis is capped at a fixed range (e.g. 85–115)
- Tickers outside the cap are clipped

**Pros:**
- Completely predictable — same scale in fit mode every time
- Easy to implement
- Familiar to StockCharts-style users

**Cons:**
- Ignores actual data distribution; may crop legitimate variation
- Hard to choose the right cap values for all use cases
- May be too narrow or too wide depending on the data epoch

### Option C: Hybrid — Fit Cluster with Outlier Indicator

**How it works:**
- Viewport fits the main cluster (using percentile-based or fixed approach)
- Tickers that fall outside the viewport are not hidden — instead, a visual indicator (e.g. arrow badge at the viewport edge) shows that off-chart tickers exist
- User can click/hover the indicator to see which tickers are off-chart, or switch to `max` mode

**Pros:**
- Best UX: user sees the cluster clearly AND knows outliers exist
- Prevents silent data loss

**Cons:**
- More implementation effort (requires off-chart indicator component)
- Adds complexity to C8 scope

---

## Recommended Decision

**Start with Option A (Percentile-Based).** Reasons:
- More principled than fixed cap
- Simpler to implement than hybrid
- The outlier information is not lost — `max` mode always shows everything
- The PRD already states: "Fit is readable for default sectors. Max shows full extreme range."

Reserve Option C for v2 if user feedback indicates the silent-clipping behavior is confusing.

---

## Decision Record (to fill in before C8)

```
Fit Mode Outlier Strategy
==========================
Strategy selected: [ ] Percentile-Based  [ ] Fixed Cap  [ ] Hybrid  [ ] Other: ___

If Percentile-Based:
  - X percentile range: ___ – ___ (e.g. 5th–95th)
  - Y percentile range: ___ – ___ (e.g. 5th–95th)
  - Padding added beyond percentile bounds: ___ units

If Fixed Cap:
  - X axis range: ___ – ___
  - Y axis range: ___ – ___

Acceptance scenario verification:
  - 15 tickers near 100/100 + one at 150/50: [PASS/FAIL] viewport shows cluster clearly
  - All tickers clustered: [PASS/FAIL] viewport fits without excessive padding
  - Single ticker only: [PASS/FAIL] viewport is sensible

Decision rationale: ___
```

---

## Acceptance Criteria

- [ ] One strategy is chosen and documented above
- [ ] Acceptance scenario: dense cluster near 100/100 with one point at 150/50 renders the cluster clearly
- [ ] The outlier is either visible in the chart or accessible via `max` viewport mode
- [ ] Axis labels/grid are readable in the cluster region when outlier is present
- [ ] Decision is referenced in C8 implementation spec
