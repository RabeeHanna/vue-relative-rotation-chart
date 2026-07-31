# Agent visual QA (C24)

Repeatable browse/click/assess workflow for the **library demo**. **Judge UX from full-page screenshot pixels first**; use DOM and `?agent=1` JSON to confirm clicks.

**Not published on npm** — this playbook, the demo `?agent=1` panel, and agent skills live in the git repo only (`package.json` `"files": ["dist"]`). Consumers get chart `data-testid` hooks (C9), not C24 demo QA tooling.

## Quick start

```bash
npm run dev
# open http://localhost:5173/?agent=1
```

- **Rubric:** [agent-visual-qa-rubric.md](./agent-visual-qa-rubric.md)
- **Skill (Cursor):** [`.cursor/skills/agent-visual-qa/SKILL.md`](../.cursor/skills/agent-visual-qa/SKILL.md)
- **Plan:** [plans/C24-agent-visual-qa.md](../plans/C24-agent-visual-qa.md)

## Agent mode (`?agent=1`)

Append `agent=1` (or `agent=true`) to any demo URL. The page shows `data-testid="agent-state-panel"` with JSON matching `AgentDemoState` (`demo/agentState.ts`).

Use this to **confirm clicks** without parsing SVG coordinates. Chart root still exposes `data-viewport-mode` and `data-selected-date` on `[data-testid="rrg-chart"]`. **Do not pass a cycle on JSON alone** if the screenshot looks wrong.

## Verification order

1. Full-page screenshot → **Read the image** (primary)
2. Click/hover as needed → screenshot again if layout may change
3. Read `agent-state-json` / chart `data-*` (secondary)

## Selector table

### Chart (C9)

| Element | `data-testid` | Notes |
|---------|---------------|-------|
| Chart SVG root | `rrg-chart` | `data-viewport-mode`, `data-selected-date` |
| Point | `rrg-point-{ticker}` | `data-quadrant`, `data-x`, `data-y` |
| Label | `rrg-label-{ticker}` | `data-visible` |
| Tail group | `rrg-tail-{ticker}` | |
| Tooltip | `rrg-tooltip` | `data-ticker` when visible |

### Demo chrome

| Control | `data-testid` |
|---------|---------------|
| App root | `demo-app` |
| Controls section | `demo-controls` |
| Scenario select | `demo-scenario` |
| Theme | `demo-theme` |
| Viewport | `rrg-viewport-{fit\|max\|center}` (in chart controls panel) |
| Label mode | `demo-label-mode` |
| Tail length | `demo-tail-length` |
| Playback loop (demo) | removed — use `rrg-playback-loop-toggle` |
| Chart host | `demo-chart-host` |
| Hover chip | `demo-hover-chip` |
| Agent state panel | `agent-state-panel` |
| Agent state JSON | `agent-state-json` |

### Playback (`RrgPlaybackControls`)

| Control | `data-testid` |
|---------|---------------|
| Playback root | `rrg-playback` |
| Scrubber | `rrg-playback-scrubber` |
| Play / pause | `rrg-playback-toggle` |
| Loop toggle | `rrg-playback-loop-toggle` |
| Loop label (when on) | `rrg-playback-loop` |

### Viewport (`RrgViewportControls`)

| Control | `data-testid` |
|---------|---------------|
| Viewport root | `rrg-viewport` |
| Mode button | `rrg-viewport-{fit\|max\|center}` |

### Chart controls panel (`RrgChartControlsPanel`)

| Control | `data-testid` |
|---------|---------------|
| Panel root | `rrg-chart-controls-panel` |
| Viewport section | `rrg-chart-controls-viewport-section` |
| Display section | `rrg-chart-controls-display-section` |
| Visibility section | `rrg-chart-controls-visibility-section` |

### Display settings (`RrgDisplaySettingsControls`)

| Control | `data-testid` |
|---------|---------------|
| Tail length | `rrg-display-tail-length` |
| Label mode | `rrg-display-label-mode` |
| Tail fade | `rrg-display-tail-fade` |

### Series visibility (`RrgSeriesVisibilityControls`)

| Control | `data-testid` |
|---------|---------------|
| Visibility root | `rrg-series-visibility` |
| Show all | `rrg-series-visibility-show-all` |
| Hide all | `rrg-series-visibility-hide-all` |
| Restore | `rrg-series-visibility-restore` |
| Row | `rrg-series-visibility-item-{ticker}` |
| Checkbox | `rrg-series-visibility-check-{ticker}` |
| Solo | `rrg-series-visibility-solo-{ticker}` |

## Example missions (`demo/agentScenarios.ts`)

| Mission | URL | Pass signal |
|---------|-----|-------------|
| Default load | `/?agent=1` | `rrg-chart` + JSON `scenario: default` |
| Viewport tour | `/?scenario=denseCluster&agent=1` | `data-viewport-mode` + JSON after select |
| Playback | `/?scenario=longPlayback50&agent=1` | scrub while paused; `data-selected-date` set |
| Label hover | `/?labelMode=hover&agent=1` | tooltip visible on hover |
| Stress hover | `/?scenario=stress&agent=1` | hover T0–T2; JSON `scenario: stress` |
| Chart controls panel | `/?scenario=default&agent=1` | panel viewport + display v-models |
| All hidden | `/?scenario=default&agent=1` | hide all → `rrg-chart-empty` |
| Series visibility | `/?scenario=default&agent=1` | solo XLK → `visibleTickerCount: 1`; restore → 6 |

Run headlessly: `npm run test:agent-guide`

## Mobile playback QA (C22)

For phone-width checks, set emulation to **390×844** and scroll playback into view:

1. `Emulation.setDeviceMetricsOverride` → `width: 390`, `height: 844`, `mobile: true`
2. Confirm `[data-testid="rrg-playback"]` has no horizontal overflow; scrubber spans the row; transport buttons ≥44px tall
3. `RrgPlaybackControls` uses `layout="auto"` (container query stacks ≤600px). Force `layout="stacked"` when the host column is narrow but the viewport is wide

## Loop protocol

Each cycle has **one explicit task**.

1. Full-page screenshot at 1440×900 (`fullPage: true`); **Read the image**.
2. Interact; screenshot again if needed; **Read the image**.
3. Confirm state via `agent-state-json` / chart `data-*`.
4. **Gate:** task visible as fixed in image? New UI issues? → fail / next cycle / pass (see rubric).
5. Smallest fix; hard reload; repeat (max 5 cycles).

Future: optional Playwright pixel-diff baselines — [C24.5](../plans/C24-agent-visual-qa.md#c245--static-pixel-diff-baselines-deferred).

## Related commands

```bash
npm run test:e2e              # chart smoke (C9)
npm run test:agent-guide      # C24.3 — walks demo/agentScenarios.ts
npm run review:artifacts      # batch screenshots (C18)
```

## Anti-goals

- Passing cycles without reading screenshot pixels
- Playwright pixel-diff CI before [C24.5](../plans/C24-agent-visual-qa.md#c245--static-pixel-diff-baselines-deferred)
- Host-app polish (use host-specific visual QA workflows)
