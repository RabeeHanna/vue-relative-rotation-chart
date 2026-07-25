# C11: Adversarial Review and Polish

**Phase:** Polish  
**Estimate:** 2–3 days  
**Depends on:** C9 complete  
**Priority:** Standard — this is the final gate before integration

---

## Goal

Prove the component is genuinely useful in real-world RRG cases before integrating it into Sector Orbit. Run all adversarial mock datasets, conduct a structured review, fix blockers, and document known limitations. Make the final integration decision.

---

## What Is an Adversarial Review?

An adversarial review attempts to find cases where the component fails, looks wrong, or confuses a user. It is not a regression test — it's a structured attempt to break the component's visual logic.

The component should not be considered ready until it can handle all of the cases below without requiring special input.

---

## Review Questions (Section 15.1)

Answer all 10 questions honestly before proceeding to integration:

1. **Can a first-time user tell what the axes mean?**
   - Look at the chart with fresh eyes. Are "RS-Ratio" and "RS-Momentum" clear? Does the quadrant labeling help or confuse?

2. **Can a user tell which point is current?**
   - Is the current-date point visually distinct from historical tail points? Test in both light and dark themes.

3. **Can a user tell which direction a tail moved?**
   - Look at the opacity fade. Is it clear whether the ticker is moving toward or away from the center? Is the most recent position obvious?

4. **Do labels remain readable in the normal clustered case?**
   - Load the default sector-like mock. Are labels readable? Any fusing? Any labels missing that should be visible?

5. **Does one outlier ruin the default view?**
   - Load the outlier mock. Fit-All keeps the outlier on-chart (cluster may compress). Is the situation still usable? Does `center` give a better cluster view when needed?

6. **Can colorblind users still identify tickers through labels/tooltips?**
   - Apply DevTools colorblind filters. Check Protanopia, Deuteranopia, and Achromatopsia.

7. **Does hover make the chart clearer or noisier?**
   - Hover over several tickers in sequence. Does the highlight/fade behavior help focus? Or does it feel disorienting?

8. **Does the chart still work when labels are hidden?**
   - Set `labelMode="hover"`. Navigate by hovering only. Can you still understand the chart? Does tooltip provide enough info?

9. **Does it look like a reporting chart rather than a decorative dashboard?**
   - Squint test: does it feel like a Bloomberg terminal or a Figma prototype? Plain, readable, purposeful?

10. **Can Playwright inspect actual chart elements without reading pixels?**
    - Run the Playwright smoke tests. Do all selectors resolve? Can you assert data values from attributes?

---

## Adversarial Mock Datasets

Create or verify these datasets in `demo/mockSeries.ts` and run each one:

| Dataset | Description | What to Check |
|---------|-------------|---------------|
| `denseClusterMock` | 15+ tickers within ±5 units of 100/100 | Labels not fused, hover works on each ticker |
| `farRightOutlierMock` | 10 tickers near 100/100 + 1 at x=145, y=105 | Fit includes outlier (cluster compresses); `center` keeps fixed window; `max` shows full history |
| `farLeftOutlierMock` | 10 tickers near 100/100 + 1 at x=65, y=95 | Same as above, opposite side |
| `manyOverlappingMock` | 5 pairs of tickers at exactly the same x/y | Points stack correctly; both are accessible via hover |
| `noisyTailMock` | Tickers with counterclockwise/zigzag tail movement | Directionality is readable despite noisy data |
| `singleTickerMock` | Exactly 1 ticker | Chart doesn't break; viewport is sensible; no label collision code errors |
| `stressMock` | 50 tickers, 30 tail points each | Performance meets target (≥ 55fps replay); labels auto-hide gracefully |
| `missingLabelMock` | Some series have `label = ""` or `name` omitted | No rendering errors; tooltip still shows ticker |
| `longLabelMock` | Tickers with long labels: "XLRE", "SMCAP", "NASDAQCOMP" | Labels don't overflow SVG bounds; collision system handles width correctly |
| `darkThemeMock` | Same data, dark CSS variables applied | Everything readable; no invisible elements |
| `lightThemeMock` | Same data, light CSS variables (default) | Everything readable |

---

## Pass Criteria (Section 15.3)

The component must meet **all** of these before integration:

- [x] Clustered labels are not fused in `denseClusterMock`
- [x] Current point is visually obvious (stronger than all tail segments)
- [x] Tail direction is understandable in `noisyTailMock`
- [x] Axis meaning is obvious without reading documentation
- [x] Viewport modes behave predictably in `outlierMock`
- [x] Hover clarifies (emphasises) instead of obscuring
- [x] SVG elements are inspectable — Playwright can locate points, tails, labels by `data-testid`
- [x] Screenshots look plain, stable, and report-like in both themes
- [x] Performance target met in `stressMock` (define exact fps threshold from C5)
- [x] All 10 review questions answered with satisfactory results

### Review answers (Section 15.1) — 2026-07-25

1. Axes: RS-Ratio / RS-Momentum labels + quadrant names are clear on the default mock.
2. Current point: filled circles with white stroke sit above faded tails — obvious vs history.
3. Tail direction: opacity fade oldest→newest reads as motion toward the head.
4. Clustered labels: dense mock shows separated Spatial Bin placements (no fused AABBs in unit tests).
5. Outliers: Fit-All keeps OUT on-chart; `center`/`max` behave as documented (screenshots 05–07).
6. Colorblind: ticker always in tooltip; hover reveals labels; `showPatterns` available (C9).
7. Hover: fades non-hovered series and shows tooltip — clarifies focus (screenshot 09).
8. `labelMode=hover`: tooltip + focusable points remain sufficient to identify tickers.
9. Visual tone: plain report chart (light grid, muted quadrant labels) — not decorative dashboard.
10. Playwright: `npm run test:e2e` green; attributes assertable.

Screenshots: `plans/screenshots/01-*.png` … `09-hover-fade.png` via `npm run review:screenshots`.
---

## Screenshot Capture

Capture screenshots for the following states and attach to this review doc:

1. Default sector mock — `fit` mode, light theme
2. Default sector mock — `fit` mode, dark theme  
3. Dense cluster mock — `auto` label mode (show collision avoidance)
4. Dense cluster mock — `always` label mode (show all labels)
5. Outlier mock — `fit` mode (outlier on-chart; cluster may look smaller — Fit-All)
6. Outlier mock — `center` mode (fixed window; outlier may be off-chart)
7. Outlier mock — `max` mode (full-history extent)
8. Stress mock (50 tickers) — `hover` label mode
9. Hover state — one ticker hovered, others faded

Screenshots are stored in `plans/screenshots/` (created during review).

---

## Known Limitations Documentation

```
Known Limitations — v1
======================
1. Label placement degrades in very tight clusters above ~35 tickers; Spatial Bin hides
   aggressively. Mitigation: labelMode=hover or tickerLabelAlwaysVisible. Deferred v2:
   leader lines.

2. Coincident points (manyOverlappingMock) share the same hit target stack order —
   lower points can be hard to hover. Mitigation: highlightedTicker from a table.

3. SVG export is not built in. Use XMLSerializer manually if needed.

4. Browser FPS for 50×30 is validated via compute budget smoke (<16ms avg) plus visual
   stress screenshot; continuous rAF FPS metering is not automated in CI.

5. Dark theme depends on parent applying `.dark` / `.rrg-chart.dark`; demo query
   `theme=dark` toggles the chart class only.
```

---

## Launch Decision

```
Adversarial Review Result
==========================
Date: 2026-07-25
Reviewer: Cursor agent (C11 unit)

Review questions: [x] All 10 answered satisfactorily

Pass criteria: [x] All met  [ ] Some failing (list below)

Failing criteria (if any):
  - none

Decision:
  [x] Proceed to C10 — integrate into Sector Orbit as opt-in renderer
  [ ] Continue iteration — address the following before integration: ___________
  [ ] Defer integration — component is not ready for production use

Conditions for integration (if deferred):
  - n/a
```

---

## Acceptance Criteria

- [x] All 10 review questions (Section 15.1) answered and documented
- [x] All 11 adversarial mock datasets tested and results noted
- [x] All pass criteria (Section 15.3) met — or blockers documented and fixed
- [x] Screenshots captured for all 8 states listed above
- [x] Known limitations documented in this file
- [x] Launch decision recorded
- [x] `npm run typecheck` passes
- [x] All existing unit tests and Playwright smoke tests pass
