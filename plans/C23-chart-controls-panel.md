# C23: Chart Controls Panel (library-owned display UI)

**Phase:** Interaction / Integration  
**Estimate:** 3–5 days (can ship incrementally)  
**Depends on:** C12 playback ✅, C8 viewport ✅, C10 host integration patterns  
**Priority:** High — Sector Orbit and future hosts must not reimplement chart display toggles  
**Status:** **Complete** (D1–D5 shipped; host follow-up in Sector Orbit pending)

---

## Goal

Own **all UI that changes how the chart looks or what it shows** inside `vue-relative-rotation-chart`. Host apps supply **precomputed series**, **dates**, and **app/data concerns** only. They compose library controls beside `<RrgChart />` — they do not fork custom sidebars for tail length, viewport, visibility, labels, loop, etc.

**Principle:** If a setting only affects SVG rendering, playback framing, or series visibility on the chart, it belongs in this package — not in Sector Orbit, not in the next host.

---

## Boundary (host vs library)

| Stays in **host** | Moves to **library** (this unit) |
|---|---|
| Universe, benchmark, date range, interval (reload data) | Series visibility (show / hide / solo / restore) |
| Price fetch, RRG calculation, cache | Tail length |
| Shareable URL, copy link, CSV export of frame data | Viewport mode (fit / max / center) |
| Debug panel, mock/yfinance, API status | Label mode (auto / always / hover) |
| App shell layout (sidebar vs mobile sheet) | Loop toggle (playback behavior tied to chart) |
| Benchmark context line (optional slot on playback) | Tail fade, performance guardrail notice |
| | PNG / SVG snapshot export (when added) |

Hosts may wrap library controls in app chrome (`<aside>`, collapsible sections). They must not duplicate the control **behavior** or **wording**.

---

## Sector Orbit inventory (today → target)

| Control (sidebar) | Host today | Library target | Status |
|---|---|---|---|
| Timeline play / scrub / speed | `RrgPlaybackControls` in `App.vue` | `RrgPlaybackControls` | ✅ Adopted |
| Viewport Fit / Max / Center | `RrgViewportControls` in `ControlsPanel` | `RrgViewportControls` | ✅ Adopted |
| Stocks/Sectors checkboxes | `ControlsPanel` + `sectorVisibility.ts` | `RrgSeriesVisibilityControls` | ✅ Shipped (C23 D1) |
| Show all / Hide all / Solo / Restore | `ControlsPanel` + host state | Same component + `useRrgSeriesVisibility` | ✅ Shipped (C23 D1) |
| Tail length | `ControlsPanel` select | `RrgDisplaySettingsControls` | ✅ Shipped (C23 D2) |
| Loop on/off | `ControlsPanel` (duplicate of playback meta) | `RrgPlaybackControls` loop emit | ✅ Shipped (C23 D3) |
| Label mode | Not exposed in host (adapter hardcodes `auto`) | `RrgDisplaySettingsControls` | ✅ Shipped (C23 D2) |
| Export PNG | echarts-only host helper | `RrgChart` export API | ✅ Shipped (C23 D5) |

---

## Deliverables (incremental)

### D1 — Series visibility (`RrgSeriesVisibilityControls`) ✅

- Controlled `visibleTickers` or `hiddenTickers` + `series` metadata (ticker, label, color swatch)
- Show all, Hide all, Solo, Restore (snapshot before solo — host logic moves to `composables/useRrgSeriesVisibility.ts`)
- Emits `update:visibleTickers`; chart already respects `series[].visible`
- Vitest + `data-testid` hooks; dark theme CSS vars like playback/viewport

### D2 — Display settings cluster ✅

- **Tail length** — select bound to `tailLength` (presets configurable via prop)
- **Label mode** — radios/select for `labelMode` (extract from demo `DemoControls`)
- **Tail fade** — optional toggle for `showTailFade`
- Shipped as `RrgDisplaySettingsControls` (also composed in `RrgChartControlsPanel`)

### D3 — Playback gaps ✅

- `RrgPlaybackControls`: `update:loop` + loop toggle button (remove host-only loop in sidebar)
- Optional slot below meta for host context (benchmark line) — document in C10

### D4 — Composed panel (optional convenience) ✅

- `RrgChartControlsPanel` — collapsible sections composing D1 + D2 + `RrgViewportControls`
- Props: pass-through v-models; `sections` prop to hide blocks hosts don't need
- Hosts with custom layout can still import pieces à la carte

### D5 — Export + empty states ✅

- SVG PNG/dataURL export on `RrgChart` ref or util
- Empty state when all series hidden (Hide all)

---

## Public API sketch

```vue
<RrgChart v-bind="chartProps" />
<RrgPlaybackControls v-model:selected-date v-model:playing v-model:speed v-model:loop ... />
<RrgChartControlsPanel
  v-model:viewport-mode
  v-model:tail-length
  v-model:label-mode
  v-model:visible-tickers
  :series="chartProps.series"
  :disabled="loading"
/>
```

All v-models map to existing `RrgChartProps` — panel is presentation + shared interaction logic only.

---

## Host follow-up (Sector Orbit — not this unit)

After C23 slices land, host unit **235** (or next chart-evolution slice):

1. Delete custom visibility UI from `ControlsPanel.vue`
2. Delete host `sectorVisibility` solo/restore UI wiring where superseded by library composable
3. Keep sidebar sections for **data** settings only (universe, benchmark, range, interval)
4. Thin adapter: map host colors into `series` once; stop reimplementing display toggles

See `sector-orbit/plans/234-mobile-layout-polish.md` and `199-chart-evolution.md`.

---

## Acceptance criteria

- [ ] No chart-display toggle remains solely in Sector Orbit production UI (except data-reload settings)
- [x] Each control component has Vitest coverage and stable `data-testid`s
- [x] Dark theme via CSS variables (matches playback/viewport)
- [x] `src/index.ts` exports control components + helpers
- [ ] C10 / README host recipe updated: compose library panel, don't copy demo sidebar
- [x] Demo playground uses same exported components (not duplicate demo-only markup)

---

## Cross-refs

- Viewport UI: shipped as `RrgViewportControls` (first C23 slice)
- Playback: [C12](./C12-playback-controls.md), mobile [C22](./C22-mobile-playback-polish.md)
- Agent QA missions + testids per control slice: [C24](./C24-agent-visual-qa.md)
- Host wiring: [C10](./C10-host-integration.md)
- Sector Orbit shell: `sector-orbit/plans/234-mobile-layout-polish.md`
