# C19 Dogfood Notes — Real-data SVG renderer

**Date:** 2026-07-25  
**Host:** Sector Orbit `feature/c10-svg-rrg-renderer`  
**Chart package:** `vue-relative-rotation-chart` via `file:../../vue-relative-rotation-chart` (`07cbc40` / local dist)  
**Do not merge host `master` as part of this exercise.**

---

## Setup

| Item | Value |
|------|--------|
| Frontend | Local Vite `http://127.0.0.1:5173` (CORS allowlist requires **5173**, not arbitrary ports) |
| API | Local `http://127.0.0.1:8000` (yfinance) |
| Flag | `?renderer=svg` → persisted `localStorage['rrg-renderer']=svg` |
| Universe | US Sector ETFs vs SPY, weekly, 1y |
| Automation | Playwright Chromium (IDE browser could not fetch `127.0.0.1:8000`) |

---

## What worked

- **Load:** Status `ready` — `yfinance: US Sector ETFs, 52 weekly frames.`
- **Renderer:** `.chart-area[data-renderer=svg]`; `[data-testid=rrg-svg-chart]` mounted with axes, quadrants, tails, points, labels.
- **DOM scale (spot check):** 11 point nodes (`rrg-point-*`), 11 labels, tail hit segments present (~44 `rrg-tail-hit`), SVG circles/lines/texts populated.
- **Scrub:** Host `replay-slider` advanced frame without throw.
- **Play / pause:** Host transport (`play-replay` / `pause-replay`) ran ~2s.
- **Viewport:** Max → Fit switched without error.
- **Hide ticker:** XLK checkbox toggled (host visibility) without crash.
- **Hover / tooltip:** Pointer on a point showed tooltip with ticker, name, date, RS-Ratio / RS-Momentum, quadrant (e.g. XLK Weakening).
- **Adapter assumptions:** Precomputed series + `selectedDate` + `tailLength` + `viewportMode` from `adaptToRrgChartInput` held for this board.

### Soft FPS sample (host play, not C17 harness)

During ~2s play: **avgFps ≈ 60**, **minFps ≈ 59.5**, **p95FrameMs ≈ 16.7** (rAF stamps in page). **No jank observed** on this product-shaped load (11 sectors, tail 5, weekly 52 frames).

---

## Friction / notes (not package blockers)

| Topic | Note |
|-------|------|
| Playback UI | Host still uses **its own** replay controls, not package `RrgPlaybackControls` (C10 optional polish). |
| Point testids | Package exposes `rrg-point-{TICKER}` (not a bare `rrg-point`). |
| CORS | Backend allows `127.0.0.1:5173` / `localhost:5173` only — frontend on **5180** fails CORS. |
| IDE browser | Cursor browser tab could not `fetch` localhost API (`Failed to fetch`); real Chromium/Playwright works. |
| Remote Render API | Also unreachable from IDE browser; shell `curl` to Render succeeded when warm. |

---

## Bugs / chart-package fixes

**None applied.** No SVG crash, empty-state misfire, or adapter break on this run.

---

## C21 evidence gate

**Not unlocked.** Real-host run completed without a concrete perf complaint or FPS soft-fail needing attribution. C21 deep profiling stays deferred per [C21-profiling-scrutiny.md](./C21-profiling-scrutiny.md) O8.

---

## Suggested follow-ups (optional)

1. Wire `RrgPlaybackControls` on the host feature branch when convenient (C10).  
2. Re-run dogfood after longer history / denser universe if host usage grows.  
3. Continue C19 README / CHANGELOG / C19.5 — publish path unblocked on dogfood notes.

---

## Artifacts (gitignored / local)

- `test-results/dogfood-svg.png`, `dogfood-svg-ready.png`  
- One-off scripts under `test-results/dogfood-svg*.mjs` (local only; not required in repo)
