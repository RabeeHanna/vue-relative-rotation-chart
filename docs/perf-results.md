# Performance results (append-only)

Raw, dated harness runs. Prefer this file (or [`plans/C17-results.md`](../plans/C17-results.md)) over paraphrased marketing claims.

Commands:

```bash
npm run test:perf
# document-only generator ceiling (env-parameterized; same Playwright file):
PERF_STRESS=1 PERF_PLAY_MS=120000 npm run test:perf -- --grep stress-ceiling
```

Artifacts (gitignored): `test-results/perf/*.json`.

---

## 2026-07-25 — product + stress ceiling (local Windows)

| Field | Value |
|-------|--------|
| When | 2026-07-25 (local Windows) |
| Browser | Chromium (Playwright) |
| SHA | `17d24fd` |
| Product command | `npm run test:perf` |
| Stress command | `PERF_STRESS=1 PERF_PLAY_MS=120000 npm run test:perf -- --grep stress-ceiling` |
| Stress load | T=100, P=500, `fullHistoryTail=true` → ~**99 800** SVG tail lines (`2×T×(P−1)`) |

### Product mode (capped tail — supported configuration)

| Profile | Interaction | avgFps | minFps | p95FrameMs | Soft ≥55 |
|---------|-------------|--------|--------|------------|----------|
| P0 (default board, L=10) | scrub | 60.00 | 59.52 | 16.8 | pass |
| P0 | play | 60.01 | 59.52 | 16.8 | pass |
| P2 (LP200, L=10) | scrub | 60.00 | 59.52 | 16.7 | pass |
| P2 | play | 60.00 | 59.52 | 16.8 | pass |

### Stress ceiling (past the breaking point — document-only)

| Profile | Interaction | avgFps | minFps | p95FrameMs | Notes |
|---------|-------------|--------|--------|------------|--------|
| stress-ceiling | scrub (~80 steps) | **4.75** | 0.43 | 1100 | Continuous scrub is where ~100k lines break down |
| stress-ceiling | play (120 s) | 60.00 | 59.52 | 16.7 | Display refresh between sparse playback ticks; **not** “scrub is fine” |

**Heap (headless `performance.memory.usedJSHeapSize` only):** ~31 MB before/after both stress interactions in this sample — not a Chrome Memory-panel soak. For growth over minutes, open the same stress URL in Chrome and watch the heap graph once manually (no automated snapshot pipeline).

**Takeaway:** Supported capped-trail boards hold ≥55 fps scrub+play. We also pushed past that with a full-history 100×500 generator load to record where continuous scrub degrades (~5 fps). That ceiling is **not** a supported product configuration.
