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
| Viewport | `demo-viewport` |
| Label mode | `demo-label-mode` |
| Tail length | `demo-tail-length` |
| Playback loop (demo) | `demo-playback-loop` |
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
| Loop (when on control) | `rrg-playback-loop` |

### Viewport (`RrgViewportControls`)

| Control | `data-testid` |
|---------|---------------|
| Viewport root | `rrg-viewport` |
| Mode button | `rrg-viewport-{fit\|max\|center}` |

## Example missions (manual until C24.2 manifest)

| Mission | URL | Pass signal |
|---------|-----|-------------|
| Default load | `/` | `rrg-chart` visible |
| Agent snapshot | `/?agent=1` | JSON `scenario` matches select |
| Viewport | `/?agent=1` + change viewport | JSON + `data-viewport-mode` update |
| Playback | `/?scenario=longPlayback&agent=1` | scrub changes `selectedDate` in JSON |
| Stress hover | `/?scenario=stress&agent=1` | hover updates `hoveredTicker` |

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
npm run review:artifacts      # batch screenshots (C18)
# npm run test:agent-guide    # C24.3 — scenario manifest guard
```

## Anti-goals

- Passing cycles without reading screenshot pixels
- Playwright pixel-diff CI before [C24.5](../plans/C24-agent-visual-qa.md#c245--static-pixel-diff-baselines-deferred)
- Host-app polish (see Sector Orbit units 217–220)
