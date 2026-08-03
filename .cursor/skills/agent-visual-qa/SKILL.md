---
name: agent-visual-qa
description: >-
  Browse and click through the vue-relative-rotation-chart demo, capture full-page
  screenshots, judge UX from the image (pixels), then confirm with agent-state JSON.
  Use for demo polish, C23 control QA, or instead of visual-ui-polish for VRRC work.
---

# Agent Visual QA (library demo)

Autonomous loop for the **VRRC Vite demo** only. No human input mid-cycle.

## Target

- URL: `http://localhost:5173/?agent=1` (or `PLAYWRIGHT_BASE_URL`)
- Dev server: `npm run dev` in repo root
- Missions: `demo/agentScenarios.ts` (headless: `npm run test:agent-guide`)
- Key `data-testid` hooks: `rrg-chart`, `rrg-playback-scrubber`, viewport/display/visibility controls in demo

## Rubric (judge from full-page screenshots)

1. Hero chart + controls fill the first viewport without a large empty band.
2. Default load shows scenario, axes, and an obvious interaction (scrub or viewport).
3. No overlapping controls, clipped labels, or dead zones in default + stress scenarios.
4. Stress scenario (`/?scenario=stress&agent=1`) remains readable.
5. A non-developer can tell what to change without reading source.

## Constraints

- Demo + exported control components only — no host apps, no chart math changes
- Prefer smallest edits with highest visual impact
- Desktop width ~1440px; **screenshot must be full-page**
- **Pixels decide pass/fail** — always `Read` the screenshot image before claiming success
- JSON/`data-*` are **secondary** — confirm clicks, not layout quality

## Screenshot (required every cycle)

1. CDP `Emulation.setDeviceMetricsOverride` → `width: 1440`, `height: 900`, `mobile: false`
2. Navigate to target URL; wait for `[data-testid="rrg-chart"]`
3. `browser_take_screenshot` with `fullPage: true` — never viewport-only
4. **`Read` the saved image file** — this is the primary evidence

## Cycle gating

Each cycle has **one explicit task**. After edit + hard reload:

| Outcome | Action |
|---------|--------|
| Image does **not** show task fixed | **Fail cycle** — fix again |
| Task fixed, image shows **new** UI issue | **Next cycle** — new task = that issue |
| Task fixed, rubric clean on image | **Pass cycle** — stop when all rubric items pass |

Max 5 cycles. **Never pass on JSON alone** if the image looks wrong.

## Loop (3–5 cycles)

```
Task Progress:
- [ ] Dev server at http://localhost:5173/?agent=1
- [ ] Cycle N: set task → screenshot → Read image → click if needed → screenshot → Read image → JSON check → edit → reload
- [ ] Stop when rubric passes on image or N=5
```

### Each cycle

1. Name the **single task** for this cycle
2. Full-page screenshot; **Read** image — baseline or post-fix assessment
3. Click/hover as needed; screenshot again; **Read** image
4. Confirm state via `agent-state-json` / chart `data-*` (secondary)
5. If image shows fix + no new issues → pass; else smallest edit; hard reload

### After cycle 2 (optional)

Spawn one `composer-2.5` Task subagent as adversarial UI critic (same rubric + screenshot path). Apply only high-confidence, small fixes.

## Anti-goals

- Passing cycles without reading screenshot pixels
- New Playwright pixel-diff CI in agent loops (see C24.5 in plan for later static baselines)
- Host-page polish (use host-specific visual QA workflows outside this repo)
- Rewriting finished chart rendering internals
