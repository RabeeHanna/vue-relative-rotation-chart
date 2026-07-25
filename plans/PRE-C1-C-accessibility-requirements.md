# PRE-C1-C: Colorblind Accessibility Requirement

**Phase:** Pre-Start Prerequisites  
**Estimate:** 0.5 day  
**Must complete before:** C2 (Types), C9 (Accessibility)  
**Priority:** Medium — upgrades colorblindness from an audit question to a stated requirement  
**Status:** Complete — 2026-07-25

---

## Goal

Formally integrate colorblind accessibility as a first-class requirement before any component code is written. This unit produces prop additions to the type spec and test cases to be added to C9.

This is a documentation and design task — no code is produced, but the decisions made here directly shape C2 (types) and C9 (accessibility testing).

---

## Decisions (COMPLETED)

### 1. Props on `RrgChartProps` — both kept

```ts
export type RrgChartProps = {
  // ... existing props (series, selectedDate, tailLength, etc.)

  // Ensures ticker identity is never conveyed by color alone
  showPatterns?: boolean          // default false; hatch/stripe patterns on points in addition to color
  tickerLabelAlwaysVisible?: boolean  // default false; overrides labelMode — all labels always shown
}
```

**`showPatterns`**
- When `true`, each ticker's point renders with a distinctive fill pattern (hatch, dots, stripes) in addition to its color
- Patterns are per-ticker and remain consistent across rerenders
- Implemented with SVG `<pattern>` elements (not CSS backgrounds)
- Target implementation unit: C9 (may ship as stub-ready prop earlier in C2)

**`tickerLabelAlwaysVisible`**
- When `true`, overrides `labelMode` — labels are always shown for all tickers, even in dense clusters
- Takes priority over the collision system's hide behavior
- User accepts that labels may overlap in exchange for full visibility

**Sector Orbit:** no consumer-specific defaults for v1 — both props default to `false`; callers opt in.

### 2. Core Requirement (Non-Optional)

> **A user who cannot distinguish any colors must be able to identify every ticker on the chart by label or tooltip alone.**

Always true regardless of props:
- In `auto` label mode: hidden labels must be revealed on hover and available in tooltip
- Ticker symbol must always be present in the tooltip (not just color or position)
- The chart must never rely solely on color to distinguish tickers in any interaction state

### 3. Test Cases for C9

```
Colorblind Test Cases
=====================
Test 1 — Protanopia simulation:
  Apply a protanopia (red-green) color blindness filter to the chart.
  Expected: Every ticker can still be identified by its label text or tooltip.
  Pass: All tickers remain uniquely identifiable without relying on color.

Test 2 — Deuteranopia simulation:
  Apply a deuteranopia (green-magenta) color blindness filter.
  Expected: Same as above.
  Pass: All tickers remain uniquely identifiable without relying on color.

Test 3 — Monochrome / grayscale:
  Convert chart to grayscale (remove all color information).
  Expected: User can still tell which ticker is which.
  Pass: Labels or patterns make tickers distinguishable.

Test 4 — Hover accessibility:
  With labelMode="auto" and a dense cluster where labels are hidden:
  Expected: Hovering over a hidden-label point reveals the ticker in tooltip.
  Pass: No ticker is ever unidentifiable.
```

Tools: Chrome DevTools → Rendering → Emulate Vision Deficiencies; Firefox accessibility panel.

---

## Acceptance Criteria for This Unit

- [x] `showPatterns` and `tickerLabelAlwaysVisible` props added to the `RrgChartProps` spec (documented here and referenced in C2)
- [x] Core colorblind requirement written: "ticker identity must never rely on color alone"
- [x] 4 colorblind test cases documented above and referenced in C9 acceptance criteria
- [x] Tooltip requirement confirmed: tooltip always includes ticker symbol, not just color/position
- [x] This document linked from both C2 and C9 plan files

---

## Notes

- **`showPatterns` deprecated (post-C13):** SVG `userSpaceOnUse` hatches “swim” as points move during playback and are illegible at small marker radii. Rendering removed; prop retained as a no-op for API compatibility. **Primary colorblind strategy:** `tickerLabelAlwaysVisible`, tooltip ticker text, and hover labels — identity must never rely on color alone.
- Colorblind simulation testing does not require automated tooling in v1. Manual verification with browser DevTools is sufficient; unit tests still cover tooltip ticker presence and label-visibility override behavior.
- If a future dual encoding is needed, prefer **shape markers** (circle / square / triangle / diamond) that move with the point — the approach used by Highcharts, Plotly, and Tableau — not fill patterns.
