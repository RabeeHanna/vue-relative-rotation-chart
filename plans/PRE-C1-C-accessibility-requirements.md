# PRE-C1-C: Colorblind Accessibility Requirement

**Phase:** Pre-Start Prerequisites  
**Estimate:** 0.5 day  
**Must complete before:** C2 (Types), C9 (Accessibility)  
**Priority:** Medium — upgrades colorblindness from an audit question to a stated requirement

---

## Goal

Formally integrate colorblind accessibility as a first-class requirement before any component code is written. This unit produces prop additions to the type spec and test cases to be added to C9.

This is a documentation and design task — no code is produced, but the decisions made here directly shape C2 (types) and C9 (accessibility testing).

---

## The Problem

The PRD (Section 15.1) asks: "Can colorblind users still identify tickers through labels/tooltips?"

But this question is never answered as a requirement anywhere in the original plan:
- The types (Section 7.2) have no colorblind-related props
- The acceptance criteria have no colorblind test cases
- The question is framed as an audit question, not a design constraint

This is backwards. If colorblindness matters (it does), it must be a stated requirement and testable acceptance criterion before building — not an afterthought audit after the component is already built.

---

## What to Decide and Document

### 1. Props to Add to `RrgChartProps`

Add these two optional props to the component API spec (to be implemented in C2):

```ts
export type RrgChartProps = {
  // ... existing props (series, selectedDate, tailLength, etc.)

  // Ensures ticker identity is never conveyed by color alone
  showPatterns?: boolean          // renders hatch/stripe patterns on points in addition to color
  tickerLabelAlwaysVisible?: boolean  // overrides labelMode — all labels always shown regardless of collision
}
```

**`showPatterns`**
- When `true`, each ticker's point renders with a distinctive fill pattern (hatch, dots, stripes) in addition to its color
- Patterns are per-ticker and remain consistent across rerenders
- Useful for presentations, printouts, or users with protanopia/deuteranopia

**`tickerLabelAlwaysVisible`**
- When `true`, overrides `labelMode` — labels are always shown for all tickers, even in dense clusters
- Takes priority over the collision system's hide behavior
- User accepts that labels may overlap in exchange for full visibility

### 2. Core Requirement (Non-Optional)

Regardless of which props are set, the following must always be true:

> **A user who cannot distinguish any colors must be able to identify every ticker on the chart by label or tooltip alone.**

This means:
- In `auto` label mode: hidden labels must be revealed on hover and available in tooltip
- Ticker symbol must always be present in the tooltip (not just color or position)
- The chart must never rely solely on color to distinguish tickers in any interaction state

This is not a new feature — it's a constraint on existing behavior. The tooltip must always include the ticker name/symbol. Labels must always be accessible on hover even if hidden in auto mode.

### 3. Test Cases to Add to C9

Add these to C9's acceptance criteria:

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

Tools for manual colorblind simulation testing:
- Chrome DevTools → Rendering → Emulate Vision Deficiencies
- Firefox accessibility panel
- Sim Daltonism (macOS)

---

## Acceptance Criteria for This Unit

- [ ] `showPatterns` and `tickerLabelAlwaysVisible` props added to the `RrgChartProps` spec (documented here and referenced in C2)
- [ ] Core colorblind requirement written: "ticker identity must never rely on color alone"
- [ ] 4 colorblind test cases documented above and referenced in C9 acceptance criteria
- [ ] Tooltip requirement confirmed: tooltip always includes ticker symbol, not just color/position
- [ ] This document linked from both C2 and C9 plan files

---

## Notes

- `showPatterns` is an enhancement — implement only in C9 or post-v1 if time is constrained. The core requirement (hover/tooltip always identifies ticker) is non-optional and should be built into every component from day 1.
- Colorblind simulation testing does not require automated tooling in v1. Manual verification with browser DevTools is sufficient.
- The pattern system (if implemented) should use SVG `<pattern>` elements, not CSS backgrounds, so it renders correctly in SVG exports.
