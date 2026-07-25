# C19 Scrutiny: Public Library Publish — Done, Gaps, and Direction

**Status:** Decisions locked (2026-07-25) — see [C19 unit plan](./C19-first-public-publish.md)  
**Date:** 2026-07-25  
**Audience:** Maintainers / reviewers  
**Depends on:** Units PRE-C1-A … C18 complete; opt-in host wiring on consumer **feature branch** (dogfood gate, not `master` merge)  
**Related:** [00-overview.md](./00-overview.md), [C19-first-public-publish.md](./C19-first-public-publish.md), [C19.5-demo-ux-simplify.md](./C19.5-demo-ux-simplify.md), [C18-pre-npm-polish.md](./C18-pre-npm-polish.md), [C17-research.md](./C17-research.md)

---

## Executive summary

This package started as a **host-first RRG SVG renderer**. That build-out is largely **done**. The goal for C19 is the first deliberate **public npm publish** of a **rotation-specialist** Vue library — not a host merge, not a generic trails framework.

**Locked direction:** ship what’s proven (RRG-style rotation charts + playback). Broader “scrubbed trail charts” / hybrid modes are an **open door**, not a plan. Keep the descriptive package name. Dogfood once against **real host series data** before publish (feature branch is enough; no `master` merge required). Fix changelog accuracy as an explicit gate.

---

## Locked decisions

| ID | Decision |
|----|----------|
| **D1** | **Primary pitch = A (rotation specialist).** Firm — not provisional. Hybrid/trails (C) needs G2 and unvalidated demand; do not treat “→ C later” as a commitment. |
| **D2** | **Keep `vue-relative-rotation-chart`.** Descriptive + discoverable > brandable-vague. Accept that a future trails pivot would pay a real rename cost. |
| **D3** | Publish blockers = checklist below **plus** accurate **`[0.1.0]` CHANGELOG** (named checkbox, not assumed). |
| **D4** | **API = G0 + light G1 docs.** Document the four-value `quadrant` enum honestly — not “caller-defined labels.” |
| **D5** | Host role = **dogfood + optional recipe**. C10 **`master` merge is not required.** Running the renderer against **real host series at least once before first npm** **is** required (P0 gate). |

---

## Product goal (locked)

### In

- Vue 3 SVG library for **RRG-style relative rotation charts** from **precomputed** series (renderer-only).
- First-class **playback / scrub** alongside the chart.
- Polished demo (GitHub Pages), honest docs, MIT, CI, semver `0.x`.

### Out (first public cut)

- Host-app `master` integration merge.
- Official JdK / StockCharts parity claims.
- Canvas/WebGL; built-in RRG calculation.
- Hybrid/generic trail mode (G2) as a deliverable.

---

## What we have shipped (by unit)

### Pre-start

| Unit | Outcome |
|------|---------|
| PRE-C1-A | Spatial Bin label collision |
| PRE-C1-B | Fit-All viewport |
| PRE-C1-C | Labels/tooltip a11y; `tickerLabelAlwaysVisible` |

### Foundation & rendering

| Unit | Outcome |
|------|---------|
| C1–C6, C8 | Skeleton, types, axes/quadrants, points, tails, viewport, labels |

### Interaction & a11y

| Unit | Outcome |
|------|---------|
| C7, C9, C12, C15 | Hover/tooltip/events, a11y hooks, playback controls, tail hit targets |
| Post-C18 | Tooltip position frozen at hover start |

### Demo, packaging, quality

| Unit | Outcome |
|------|---------|
| C11–C18 | Adversarial review, demo + sessions, packaging/CI, tail hover, scrub coalesce, perf harness, pre-npm polish |

### Host dogfood

| Item | Status |
|------|--------|
| Opt-in SVG (`?renderer=svg`) | On consumer **`feature/c10-svg-rrg-renderer`**; default branch unchanged |
| Real-data exercise log | **Required in C19** before npm (not yet done as a published gate) |

---

## Publish checklist (C19 gate)

- [x] MIT + SECURITY + CONTRIBUTING  
- [x] CI (typecheck, lint, test, e2e)  
- [x] Peer Vue; `dist` + types + `style.css` + scenarios  
- [x] Public scrub hard-gate; review artifacts scripts  
- [ ] README: rotation-specialist pitch; precise quadrant wording; **enumerated fragile surfaces**  
- [ ] **`CHANGELOG.md` `[0.1.0]` accurately reflects shipped surface** (fold/sync from Unreleased as needed)  
- [x] **Real-data dogfood** on host feature branch — notes logged (what worked / what broke)  
- [ ] Getting-started path verified cold (`npm i` + minimal example)  
- [ ] Demo UX polish ([C19.5](./C19.5-demo-ux-simplify.md)) — Simple/Customize, closed snippet, Tail/Full history  
- [x] **Packaging:** `"files": ["dist"]` — demo/tests/plans/spikes **not** in npm tarball (confirmed; no change)  
- [x] **Bundle size tracked** ([C20](./C20-bundle-size-perf-playbook.md) — soft warn; independent of deep profiling)  
- [ ] Optional: demo **page** Lighthouse sanity (document-only; **not** chart FPS — see C21 O2)  
- [ ] Deliberate `npm publish` + restore version badges  

---

## Fragile surfaces (enumerate in README — P0.4)

List explicitly for early adopters (not only “API may change”):

1. **`RrgQuadrant` enum** — fixed four values (`leading` \| `weakening` \| `lagging` \| `improving`)  
2. **Playback control prop / `v-model` emit names** (`selectedDate`, `playing`, `speed`, …)  
3. **`copy` / copy-override shapes** (`RrgChartCopy`, `RrgPlaybackCopy`)  
4. **Chart prop defaults** that affect visuals (`showTailFade`, `labelMode`, radii) — document as semi-stable but `0.x`

---

## Quadrant docs wording (D4 — required precision)

Use something equivalent to:

> The `quadrant` field currently accepts these four values: `leading`, `weakening`, `lagging`, and `improving`. A fully generic labeling scheme is deferred to a future major version.

Do **not** say “quadrant is caller-defined” without that caveat.

---

## Priorities after locks

| Priority | Work |
|----------|------|
| **P0** | README + fragile list + quadrant wording; CHANGELOG `[0.1.0]` accuracy; **real-data dogfood log**; publish |
| **P1** | **P1.2 Demo polish** — [C19.5](./C19.5-demo-ux-simplify.md) before/with publish push; optional host recipe doc (no `master` merge) |
| **P2** | Perf follow-ups from C17; docs site; G2 only if demand appears |
| **P3** | Host `master` C10 merge; Canvas; calc-in-package; full-history default |

---

## Cross-refs

- Implementation unit: [C19-first-public-publish.md](./C19-first-public-publish.md)  
- Demo UX: [C19.5-demo-ux-simplify.md](./C19.5-demo-ux-simplify.md)  
- Unit map: [00-overview.md](./00-overview.md)  
- Host plan (dogfood): [C10-host-integration.md](./C10-host-integration.md)

---

## Revision log

| Date | Note |
|------|------|
| 2026-07-25 | Initial scrutiny draft |
| 2026-07-25 | **Locked D1–D5** from review: pitch A firm; keep name; changelog gate; G0+precise G1 docs; dogfood-before-publish (not master merge) |
| 2026-07-25 | Packaging confirmed (`files: ["dist"]`); C19.5 demo UX added as publish-adjacent P1.2 |
| 2026-07-25 | C21 review: bundle-size → C20 checklist; optional demo Lighthouse one-liner (≠ chart FPS); deep profiling deferred |
