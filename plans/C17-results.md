# C17 Results (append-only)

Do **not** overwrite prior entries. Add a new dated section (or file under `C17-results/`) for each run so trends stay visible without digging through git history.

Target (soft): **≥55 fps** avg for **P0** and **P2**, scrub **and** play. Full-history / ceiling probes are document-only.

---

## 2026-07-25 — local Chromium baseline (`e8279c9` parent + C17 harness)

| Field | Value |
|-------|--------|
| When | 2026-07-25 (local Windows) |
| Command | `npm run test:perf` |
| Browser | Chromium (Playwright Desktop Chrome) |
| Gate | Soft (`PERF_HARD_GATE` unset); ceiling skipped (`PERF_CEILING` unset) |
| SHA | `d0cb6eb` |

| Profile | Interaction | avgFps | minFps | p95FrameMs | frames | Soft ≥55 |
|---------|-------------|--------|--------|------------|--------|----------|
| P0 | scrub | 59.99 | 59.52 | 16.8 | 34 | pass |
| P0 | play | 60.00 | 59.52 | 16.8 | 110 | pass |
| P2 | scrub | 60.00 | 59.52 | 16.7 | 120 | pass |
| P2 | play | 60.00 | 59.52 | 16.8 | 164 | pass |
| D3-ceiling | scrub | 60.01 | 59.52 | 16.8 | 64 | document-only (ran with `PERF_CEILING=1`) |

Artifacts: `test-results/perf/P0-*.json`, `P2-*.json`, `D3-ceiling-*.json` (gitignored).

Notes: First harness run after C16 stable keys + scrub coalesce. Layer A Vitest node-counts hard-gated in `npm test`. Full-history scrub still ~60fps on this machine for LP100 — document only; do not promote to must-pass without C10 confirmation. Revisit P0–P3 definitions after C10.

---

## 2026-07-25 — local Chromium re-run (path A / C21 evidence check)

| Field | Value |
|-------|--------|
| When | 2026-07-25 (local Windows) |
| Command | `PERF_CEILING=1 npm run test:perf` |
| Browser | Chromium (Playwright; browsers re-installed) |
| Gate | Soft (`PERF_HARD_GATE` unset); ceiling included |
| SHA | `07cbc40` |

| Profile | Interaction | avgFps | minFps | p95FrameMs | frames | Soft ≥55 |
|---------|-------------|--------|--------|------------|--------|----------|
| P0 | scrub | 60.01 | 59.52 | 16.7 | 36 | pass |
| P0 | play | 60.00 | 59.52 | 16.8 | 104 | pass |
| P2 | scrub | 60.00 | 59.52 | 16.7 | 123 | pass |
| P2 | play | 60.00 | 59.52 | 16.8 | 161 | pass |
| D3-ceiling | scrub | 60.00 | 59.52 | 16.7 | 61 | document-only |

**C21 evidence gate:** **not met** — no soft miss / regression requiring attribution. Path A does not unlock [C21](./C21-deep-profiling.md) on this run.

---
