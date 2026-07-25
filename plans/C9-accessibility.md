# C9: Accessibility and Agent-Testability

**Phase:** Polish  
**Estimate:** 1 day  
**Depends on:** C7 complete, [PRE-C1-C](./PRE-C1-C-accessibility-requirements.md) (colorblind requirement) documented  
**Priority:** Standard

---

## Goal

Make the chart understandable and testable without pixel inspection. Add accessible summaries, stable `data-testid` hooks for Playwright, ARIA roles, and verify colorblind accessibility using browser simulation tools.

---

## Scope

### Accessible Chart Summary

Add a visually hidden `<title>` and `<desc>` element to the SVG:

```vue
<svg :aria-labelledby="`${chartId}-title`" :aria-describedby="`${chartId}-desc`" role="img">
  <title :id="`${chartId}-title`">
    Relative Rotation Chart — {{ selectedDate }}
  </title>
  <desc :id="`${chartId}-desc`">
    RRG chart showing {{ visibleSeriesCount }} tickers as of {{ selectedDate }}.
    Viewport mode: {{ viewportMode }}.
    Leading quadrant: {{ leadingTickers.join(', ') || 'none' }}.
    Improving quadrant: {{ improvingTickers.join(', ') || 'none' }}.
  </desc>
  <!-- chart content -->
</svg>
```

The `chartId` should be a unique ID generated with `useId()` or a passed prop to avoid collisions when multiple charts are on the same page.

---

### `data-testid` Audit

Verify and document all stable test hooks. The following must exist after all units (C1–C7) are complete:

| Element | `data-testid` | Additional attributes |
|---------|--------------|----------------------|
| Root SVG | `rrg-chart` | `data-viewport-mode`, `data-selected-date` |
| Each point | `rrg-point-{ticker}` | `data-ticker`, `data-x`, `data-y`, `data-quadrant` |
| Each label | `rrg-label-{ticker}` | `data-visible` |
| Each tail group | `rrg-tail-{ticker}` | |
| Tooltip | `rrg-tooltip` | `data-ticker` when visible |

Add any missing attributes. Confirm all `data-testid` values are lowercase, use hyphens, and do not change during replay.

---

### Optional Focusable Points

For keyboard accessibility, points can optionally be made focusable:

```vue
<circle
  :data-testid="`rrg-point-${point.ticker}`"
  tabindex="0"
  :aria-label="`${point.ticker} — ${point.quadrant} quadrant, RS-Ratio ${point.x.toFixed(1)}, RS-Momentum ${point.y.toFixed(1)}`"
  @focus="onPointEnter(point)"
  @blur="onPointLeave()"
  @keydown.enter="onPointClick(point)"
/>
```

This is a v1 minimum — not full keyboard navigation, but allows screen readers to enumerate all chart points via Tab key.

---

### Colorblind Verification (from [PRE-C1-C](./PRE-C1-C-accessibility-requirements.md))

Perform manual colorblind simulation tests using Chrome DevTools:

**Test procedure:**
1. Open the demo page with a dense cluster mock (15+ tickers)
2. Open DevTools → Rendering → Emulate Vision Deficiencies
3. Apply each filter and verify:

| Test | Filter | Pass Criteria |
|------|--------|---------------|
| 1 — Protanopia | Protanopia | Every ticker identifiable by label or tooltip |
| 2 — Deuteranopia | Deuteranopia | Every ticker identifiable by label or tooltip |
| 3 — Monochrome | Achromatopsia | Tickers distinguishable (labels or patterns) |
| 4 — Hover accessibility | (no filter) `labelMode="auto"` dense cluster | Hovering a hidden-label point reveals ticker in tooltip |

**Core requirement (non-optional):**
- The tooltip always includes ticker symbol — never only color or position
- In `auto` label mode: hovering a hidden-label point always reveals the ticker
- In `hover` label mode: hovering always shows the label
- `tickerLabelAlwaysVisible=true` forces all labels visible (overrides `labelMode` / collision hide)

**`showPatterns` prop (deprecated):**
- Originally: SVG hatch/dot fills per ticker
- **Deprecated:** fills use chart-space tiling and appear to move under animating points; poor at ~5px radius
- Prop remains accepted (data attribute only); **no pattern rendering**
- Prefer `tickerLabelAlwaysVisible` for monochrome / colorblind demos

**`tickerLabelAlwaysVisible` prop:**
- Primary non-color identity strategy alongside tooltip ticker text
- Prop is part of the C2 public contract; rendering lands in this unit (C9)

---

### Playwright Smoke Test File

Create `tests/e2e/chart.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('chart renders with correct test IDs', async ({ page }) => {
  await page.goto('/')
  
  // Chart root
  const chart = page.getByTestId('rrg-chart')
  await expect(chart).toBeVisible()

  // Specific tickers from mock data
  await expect(page.getByTestId('rrg-point-XLK')).toBeVisible()
  await expect(page.getByTestId('rrg-point-XLF')).toBeVisible()

  // Label exists in DOM (may be hidden)
  await expect(page.getByTestId('rrg-label-XLK')).toBeAttached()
})

test('hover reveals tooltip with ticker info', async ({ page }) => {
  await page.goto('/')

  const point = page.getByTestId('rrg-point-XLK')
  await point.hover()

  const tooltip = page.getByTestId('rrg-tooltip')
  await expect(tooltip).toBeVisible()
  await expect(tooltip).toContainText('XLK')
  await expect(tooltip).toContainText('RS-Ratio')
})

test('point data attributes are correct', async ({ page }) => {
  await page.goto('/')

  const point = page.getByTestId('rrg-point-XLK')
  const quadrant = await point.getAttribute('data-quadrant')
  expect(['leading', 'weakening', 'lagging', 'improving']).toContain(quadrant)
  
  const x = parseFloat(await point.getAttribute('data-x') ?? '0')
  expect(x).toBeGreaterThan(0)
})

test('labels accessible in labelMode=always', async ({ page }) => {
  await page.goto('/?labelMode=always')

  // All labels should be visible
  await expect(page.getByTestId('rrg-label-XLK')).toBeVisible()
  await expect(page.getByTestId('rrg-label-XLF')).toBeVisible()
})
```

---

## Unit Tests

```
tests/
  accessibility.test.ts
    - SVG has aria-labelledby pointing to title element
    - SVG has aria-describedby pointing to desc element
    - Title element contains selectedDate
    - data-testid attributes are present on all points
    - data-testid attributes are stable across selectedDate changes
    - data-quadrant attribute matches expected quadrant for given x/y
```

---

## Acceptance Criteria

- [x] SVG has `<title>` and `<desc>` with meaningful accessible content
- [x] SVG has `role="img"`, `aria-labelledby`, `aria-describedby`
- [x] Chart root has `data-testid="rrg-chart"` with `data-viewport-mode` and `data-selected-date`
- [x] Every point has `data-testid="rrg-point-{ticker}"`, `data-x`, `data-y`, `data-quadrant`
- [x] Every label has `data-testid="rrg-label-{ticker}"` and `data-visible`
- [x] Every tail group has `data-testid="rrg-tail-{ticker}"`
- [x] Tooltip has `data-testid="rrg-tooltip"` and `data-ticker` when visible
- [x] All `data-testid` values are stable across rerenders and date changes
- [x] **COLORBLIND Test 1:** Protanopia — all tickers identifiable by label/tooltip
- [x] **COLORBLIND Test 2:** Deuteranopia — all tickers identifiable by label/tooltip
- [x] **COLORBLIND Test 3:** Achromatopsia — tickers distinguishable without color
- [x] **COLORBLIND Test 4:** Hover on hidden-label point reveals ticker in tooltip
- [x] Tooltip always includes ticker symbol in all interaction states
- [x] `tickerLabelAlwaysVisible` overrides collision hide when true
- [x] `showPatterns` deprecated — prop accepted, no hatch rendering (labels-first a11y)
- [x] Points are focusable via Tab key and announce themselves to screen readers
- [x] Playwright smoke tests pass (`tests/e2e/chart.spec.ts`)
- [x] `npm run typecheck` passes

### Colorblind verification notes (C9)

Identity is never color-only: tooltip always includes ticker; hover reveals labels; `tickerLabelAlwaysVisible` for monochrome. `showPatterns` is deprecated (no rendering). Automated coverage: `tests/accessibility.test.ts`, `tests/e2e/chart.spec.ts`. Manual DevTools vision filters remain recommended for visual QA.
