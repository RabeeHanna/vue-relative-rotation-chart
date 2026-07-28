# Agent visual QA rubric (library demo)

Checklist for the Vite demo at `http://localhost:5173`. **Judge from full-page screenshots (pixels) first.** DOM/JSON confirms clicks; it does not override a bad-looking image.

## Verification order (every cycle)

1. **Screenshot** — `fullPage: true` at ~1440px desktop width; `Read` the image file.
2. **Vision** — does the image show the cycle task fixed? Any new UI problems?
3. **DOM/JSON** (secondary) — after interactions, confirm `data-*` / `agent-state-json` matches expectations.

## Desktop layout (~1440px wide) — judge from image

1. **Hero chart** — chart + primary controls occupy most of the first viewport; no large empty band above the fold.
2. **Obvious entry** — default load shows scenario name, axes, and at least one clear interaction (scrub or viewport).
3. **Full-page capture** — one screenshot includes chart **and** control chrome (no viewport-only shots).

## Operability — image + DOM

4. **No dead / broken UI** — from the image: no overlapping controls, clipped labels, or obvious dead zones in default + stress scenarios.
5. **Controls reachable** — scenario, viewport, labels, tail, playback transport visible and not obscured (see [agent-visual-qa.md](./agent-visual-qa.md) for `data-testid` targets when clicking).
6. **Clicks change state** — after a click: new screenshot if layout may shift; JSON/`data-*` must agree (viewport, date, playing, loop).

## Quality bar — image first

7. **Stress scenario** — `/?scenario=stress&agent=1` looks usable; labels/points not an unreadable mess.
8. **Layperson glance** — a non-developer can tell what to change without reading source.
9. **No collateral regressions** — fixing one issue must not introduce new overlap, empty bands, or shrunk chart (check image after every fix).

## Cycle gating (normative)

Each cycle has **one explicit task** (e.g. “remove empty band under chart”, “make scrubber full width”).

| Outcome | Verdict |
|---------|---------|
| Image does **not** show the task fixed | **Cycle fails** — do not advance; fix again |
| Task looks fixed, but image shows **new** UI problem | **Open next cycle** with that problem as the new task |
| Task fixed **and** image passes rubric items 1–9 | **Cycle passes** — stop only when all rubric items pass |

Max **5 cycles** per session. JSON-only pass is **invalid** if the screenshot disagrees.

## Out of scope (this rubric)

- Host app shells (Sector Orbit)
- Automated pixel-diff CI (deferred — [C24.5](../plans/C24-agent-visual-qa.md#c245--static-pixel-diff-baselines-deferred) in plan)
- Backend or RRG calculation
