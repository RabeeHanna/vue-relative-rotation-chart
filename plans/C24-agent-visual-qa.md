# C24: Agent Visual QA Loop

**Phase:** Quality / Agent Tooling  
**Estimate:** 2–4 days (can ship incrementally)  
**Depends on:** [C9](./C9-accessibility.md) ✅, [C13](./C13-demo-playground.md) ✅, [C18](./C18-pre-npm-polish.md) ✅ (`review:artifacts` harness)  
**Priority:** High — repeatable agent browse/click/assess loop for demo + library controls; feeds C22/C23 polish  
**Status:** **In progress** (C24.1–C24.3 shipped; C24.4 missions per C23 control pending)

---

## Goal

Ship a **generic, repo-owned** workflow so AI agents (Cursor browser, Playwright, future SDK agents) can **open the demo, click through controls, capture full-page screenshots, judge UX from the image (pixels), and confirm interactions via structured state** — without mandatory pixel-diff CI or host-app scope.

This unit **extends** C9 (static `data-testid` hooks) and C18 (batch screenshot artifacts) with an **interactive loop** that can drive library improvements and new features. If successful, it **replaces** the ad-hoc `visual-ui-polish` skill for VRRC work; hosts (e.g. Sector Orbit) adopt the same patterns in their own follow-up units.

**Principle:** **Pixels (screenshot vision) are the primary pass/fail gate.** Agents `Read` full-page images to judge layout, spacing, and whether a cycle task is fixed. DOM `data-testid`, ARIA, and `?agent=1` JSON **confirm** that clicks changed state — they do not override a bad-looking screenshot.

---

## Relationship to existing work

| Existing | Role | C24 adds |
|---|---|---|
| [C9](./C9-accessibility.md) | Chart `data-testid`, ARIA, Playwright smoke | Demo + control panel hooks; interaction recipes |
| [C11](./C11-adversarial-review.md) | One-time adversarial datasets + questions | Repeatable scenario manifest + agent runbook |
| [C18](./C18-pre-npm-polish.md) | `npm run review:artifacts` (batch PNG + JSON) | Interactive tours + rubric-scored cycles |
| `visual-ui-polish` skill (user) | Host-page polish loop | **Library demo** rubric + skill lives **in this repo** |
| Sector Orbit 217–220 | Host click-testable + Playwright smoke | Cross-ref only; host migration is not C24 |

C9 answered “can Playwright find elements?” C24 answers “can an agent **operate the product like a user** and **iterate on UX** with a defined stop condition?”

---

## Scope

### D1 — Agent QA rubric (library demo)

Version-controlled rubric for the **Vite demo playground** (not host shells). Items are judged **from full-page screenshots** first; see `docs/agent-visual-qa-rubric.md`.

1. Chart + primary controls own the first viewport on desktop (~1440px) — **visible in image**
2. Default demo load is understandable without reading source — **visible in image**
3. Every exported control is operable via `data-testid` or native semantics
4. After clicks: **new screenshot** if layout may change; JSON/`data-*` confirm state
5. No dead clicks, overlapping controls, or broken empty states — **visible in image**
6. Full-page screenshot captures chart **and** control chrome in one image

### D1b — Cycle gating (normative)

Each cycle has **one explicit task**. After edit + hard reload:

- **Fail** if the image does not show the task fixed (even if JSON looks correct).
- **Next cycle** if the task is fixed but the image shows a **new** UI problem (collateral regression).
- **Pass** only when the task is fixed **and** rubric items pass on the image.

Max 5 cycles per session. Documented in rubric + skill.

### D2 — Scenario manifest (browse & click recipes)

`demo/agentScenarios.ts` (or `tests/agent/scenarios.ts`) — typed list of **agent missions**:

| Mission | Entry URL | Steps (high level) | Pass signals |
|---|---|---|---|
| Default load | `/` | wait chart | `rrg-chart` visible; default scenario tickers |
| Viewport tour | `/?scenario=dense` | fit → max → center | `data-viewport-mode` on chart root |
| Playback tour | `/?scenario=longPlayback` | scrub, play/pause, loop | `data-selected-date` changes; transport `aria-pressed` |
| Label modes | `/?labelMode=hover` | hover point | tooltip + label visibility |
| Stress | `/?scenario=stress` | hover 3 tickers | no console errors; chart responsive |

Each scenario exports: `id`, `url`, `readyTestId`, `steps[]` with `{ action, target, expect }` where `action` is `goto | click | hover | fill | screenshot | readState`.

Used by: agent skill, optional Playwright guide spec, docs.

### D3 — Machine-readable demo state (`?agent=1`)

Toggle on demo app (query param or dev-only panel):

- `data-testid="agent-state-panel"` with `<pre>` or hidden JSON blob
- Snapshot: `scenario`, `selectedDate`, `viewportMode`, `labelMode`, `tailLength`, `playing`, `speed`, `loop`, visible ticker count, chart dimensions
- Lets agents **verify** clicks without parsing SVG coordinates
- Vitest: panel hidden by default; visible when `?agent=1`

Does **not** duplicate host debug panels (Sector Orbit 219); this is **library demo only**.

**Publish boundary:** `?agent=1`, `agentState.ts`, `DemoAgentStatePanel`, rubric/docs, `.cursor/skills/agent-visual-qa`, and future C24.2–C24.5 harnesses are **not** published on npm (`package.json` `"files": ["dist"]` only). Chart `data-testid` hooks (C9) **do** ship in `dist/` for consumer Playwright — that is separate from C24 demo QA tooling. Guarded by `tests/perf/packageExclusion.test.ts` and `publishBoundary.test.ts`.

### D4 — Demo + control `data-testid` audit

Extend C9 audit to **all demo chrome** and **exported control components**:

| Area | Required hooks |
|---|---|
| Demo scenario select | `demo-scenario` |
| Playback transport | existing `rrg-playback-*` |
| Viewport | existing `rrg-viewport-*` |
| C23 controls (as they land) | `rrg-controls-*` prefix |
| Agent state panel | `agent-state-panel` |

Document in `docs/agent-visual-qa.md` with selector table (mirrors C9 chart table).

### D5 — In-repo agent skill (replaces `visual-ui-polish` for VRRC)

`.cursor/skills/agent-visual-qa/SKILL.md` (~60–100 lines):

- Target: `http://localhost:5173` (or `PLAYWRIGHT_BASE_URL`)
- Loop: task → full-page screenshot → **Read image** → click → screenshot → **Read image** → JSON check → edit → reload (3–5 cycles)
- Screenshot protocol: desktop 1440×900 via CDP, `fullPage: true`
- **Pixels decide pass/fail**; `agent-state-panel` / chart `data-*` confirm clicks only
- Cycle gating: fail if task not visible in image; new cycle for collateral UI issues
- Anti-goals: no C24.5 pixel-diff CI yet; no host-app edits; no chart math changes

Optional: spawn adversarial critic subagent after cycle 2.

### D6 — Thin Playwright “guide” spec (optional, not visual CI)

`tests/e2e/agent-guide.spec.ts` — **walks the scenario manifest** using the same selectors agents use:

- Not screenshot diffing
- Proves missions are **executable** headlessly
- Runs in CI as smoke extension (fast subset) or `npm run test:agent-guide` locally

Keeps agent recipes honest when demo markup changes.

### D7 — Docs + scripts

| Artifact | Purpose |
|---|---|
| `docs/agent-visual-qa.md` | Maintainer playbook: dev server, missions, rubric, skill path |
| `npm run test:agent-guide` | Run guide spec (subset) |
| `CONTRIBUTING.md` blurb | “Before UX polish PRs, run agent QA loop or guide spec” |

---

## Agent loop protocol (normative)

```
Task Progress:
- [ ] Dev server at TARGET_URL/?agent=1
- [ ] Cycle N: name task → screenshot → Read image → interact → screenshot → Read image → JSON check → edit → reload
- [ ] Stop when rubric passes on image or N=5
```

**Each cycle**

1. **Name one task** (e.g. “shrink empty band below chart”).
2. Navigate mission URL; wait `readyTestId`.
3. Full-page screenshot at 1440px; **`Read` the image** — assess task + rubric.
4. Execute manifest steps (click/hover); screenshot again if layout may change; **`Read` image**.
5. Confirm clicks via DOM/JSON (secondary).
6. **Gate:** image shows task fixed? New UI issues? → fail / next cycle / pass per D1b.
7. Apply smallest code fix; hard reload before next cycle.

**Out of scope for the loop:** backend, RRG calculation, host sidebar layout.

---

## Incremental delivery

| Slice | Ships | Unblocks |
|---|---|---|
| **C24.1** | Rubric + docs + skill stub + `?agent=1` panel | Manual agent cycles on demo ✅ |
| **C24.2** | Scenario manifest + demo testid audit | Repeatable click recipes ✅ |
| **C24.3** | `agent-guide.spec.ts` + npm script | CI guard for recipes ✅ |
| **C24.4** | Missions for each C23 control as it lands | Library feature QA |
| **C24.5** | Static pixel-diff baselines (deferred) | CI regression net under agent vision |

### C24.5 — Static pixel-diff baselines (deferred)

**Not part of C24.1–C24.4.** Optional follow-up after agent vision loop is stable.

Playwright `toHaveScreenshot` (or Percy/Chromatic) on a **small frozen set** of demo URLs — playback paused, no hover, fixed theme:

| Baseline mission | Example URL | Why frozen |
|------------------|-------------|------------|
| Default light | `/?scenario=default&agent=1` | Layout smoke |
| Default dark | `/?theme=dark&agent=1` | Theme vars |
| Stress paused | `/?scenario=stress&agent=1` | Dense labels |
| Mobile shell | `/?agent=1` @ 390×844 | C22 follow-up |

**Role:** safety net **under** agent vision — catches unintentional layout drift on stills. **Not** a replacement for rubric-based image review. **Not** used for live scrub/play animations (too flaky).

Deliverables when unlocked: baseline PNGs under `tests/e2e/visual-baselines/`, `npm run test:visual-regression`, tolerance documented, CI job optional/manual pre-release. **C24.5 baselines also stay out of the npm tarball** (tests-only).

---

## Publish boundary

C24 is **local dev + CI only**. Nothing in this unit ships to npm consumers.

| Ships on npm (`dist/` only) | Stays repo-local (not in tarball) |
|---|---|
| Chart components + `data-testid` (C9) | `demo/?agent=1` panel, `agentState.ts`, `DemoAgentStatePanel` |
| Public types, scenarios export | `docs/agent-visual-qa*.md`, `.cursor/skills/agent-visual-qa/` |
| | `tests/e2e/agent-guide*`, C24.5 visual baselines, `plans/C24-*` |

Enforced by `package.json` `"files": ["dist"]` and `tests/perf/packageExclusion.test.ts` + `publishBoundary.test.ts` (npm pack + dist string scan).

---

## Out of scope (C24.1–C24.4)

- **npm publish of C24 tooling** — see [Publish boundary](#publish-boundary)
- **Automated pixel-diff CI** — deferred to [C24.5](#c245--static-pixel-diff-baselines-deferred)
- Autonomous unsupervised third-party agent APIs on production sites
- Sector Orbit host shell polish (hosts copy rubric + manifest pattern in their own unit)
- Replacing Vitest unit tests or C17 perf harness
- Canvas/WebGL pixel sampling (use screenshot vision for SVG layout)

---

## Acceptance criteria

- [x] `docs/agent-visual-qa-rubric.md` and `docs/agent-visual-qa.md` exist and are linked from README
- [x] `.cursor/skills/agent-visual-qa/SKILL.md` documents the full loop (screenshot protocol included)
- [x] Demo supports `?agent=1` with `data-testid="agent-state-panel"` and stable JSON shape
- [x] Scenario manifest covers ≥5 missions (default, viewport, playback, labels, stress)
- [x] All demo + exported control interactions in manifest have `data-testid` or semantic selectors
- [x] Agent can complete viewport + playback missions using only documented selectors
- [x] `tests/e2e/agent-guide.spec.ts` passes locally (≥3 missions)
- [x] `npm run test:agent-guide` documented
- [x] Rubric + skill require **Read screenshot image** before cycle pass (vision-first gate)
- [x] Cycle gating documented: fail if task not in image; new cycle for collateral UI issues
- [ ] No C24.5 pixel-diff CI until C24.5 slice (agent vision is primary until then)
- [x] `npm pack` / `dist/` guards exclude C24 demo agent QA from published tarball
- [ ] C23 new controls add missions + testids in same PR as each control slice (cross-ref)

---

## Used by

- [C22](./C22-mobile-playback-polish.md) — add mobile viewport mission (390×844) after desktop passes
- [C23](./C23-chart-controls-panel.md) — each new control block gets manifest entries + testids
- [C10](./C10-host-integration.md) — host dogfood can fork manifest pattern (not C24 scope)
- Future: publish skill path in package README for consumers

## Cross-refs

- Inspectability foundation: [C9](./C9-accessibility.md)
- Batch artifacts: [C18](./C18-pre-npm-polish.md), `tests/e2e/adversarial-screenshots.spec.ts`
- Host analogue: `sector-orbit/plans/217-click-testable-controls.md`, `220-playwright-smoke-tests.md`
- Supersedes for VRRC: user `visual-ui-polish` skill (host-only); keep that skill for Sector Orbit until host adopts C24 pattern
