# C19: First Public Publish — Rotation Specialist npm Cut

**Phase:** Packaging / Trust  
**Estimate:** 1–2 days  
**Depends on:** [C18](./C18-pre-npm-polish.md) complete; decisions locked in [C19-public-library-scrutiny.md](./C19-public-library-scrutiny.md); prefer [C19.5](./C19.5-demo-ux-simplify.md) **before** publish  
**Suggested schedule:** Immediately after scrutiny lock; **before** first `npm publish`  
**Priority:** High — publish gate  
**Status:** Draft — ready to implement  

---

## Goal

Ship the first deliberate public **`0.1.x`** of `vue-relative-rotation-chart` as a **rotation-specialist** Vue SVG library: honest README, accurate changelog, enumerated `0.x` fragile surfaces, one **real-data dogfood** pass on the host feature branch (no consumer `master` merge), demo UX polish ([C19.5](./C19.5-demo-ux-simplify.md)), then `npm publish` + badge restore.

**Not in scope:** renaming the package; G2 hybrid/trail API; VitePress/Histoire; merging C10 into the host default branch; Canvas/WebGL; calculation-in-package; shipping `demo/` on npm (already excluded).

---

## Locked decisions (from scrutiny)

| ID | Lock |
|----|------|
| D1 | Pitch **A — rotation specialist** (firm; hybrid is an open door, not a plan) |
| D2 | **Keep** name `vue-relative-rotation-chart` |
| D3 | Publish checklist **+** accurate `[0.1.0]` CHANGELOG as a named gate |
| D4 | API **G0** + light docs: four-value `quadrant` enum stated precisely (no overclaim) |
| D5 | Host = dogfood + optional recipe; **`master` merge not required**; **real-data run before npm is required** |

Full rationale: [C19-public-library-scrutiny.md](./C19-public-library-scrutiny.md).

---

## Workstreams

### A — README / public narrative

1. Hero pitch: RRG-style **relative rotation** charts for Vue (renderer-only).  
2. Precise `quadrant` wording (scrutiny § Quadrant docs wording).  
3. **Fragile surfaces** section — enumerate at least:
   - `RrgQuadrant` four-value enum  
   - Playback props / `v-model` emit names  
   - `copy` override shapes  
   - Notable visual defaults (`showTailFade`, `labelMode`, radii)  
4. Semver: pre-1.0 may change; point readers at the fragile list (not only a vague disclaimer).  
5. Keep install path honest until publish, then flip to `npm install` + restore npm version badge (Bundlephobia optional).

### B — CHANGELOG accuracy

1. Rewrite **`## [0.1.0]`** so it reflects the real shipped surface (chart, playback, scenarios, theming, a11y, scrub coalesce, date snap, etc.) — not a two-bullet undersell.  
2. Move or trim **`[Unreleased]`** so publish doesn’t leave a misleading gap (either empty Unreleased post-publish, or fold C18/post-C18 notes into `0.1.0` / `0.1.1` as appropriate).  
3. Named acceptance checkbox: changelog accuracy verified before `npm publish`.

### C — Real-data dogfood (P0 gate)

1. On the **host** repo feature branch (`feature/c10-svg-rrg-renderer` or successor): run `?renderer=svg` against **non-mock** (yfinance / live calculated) series.  
2. Exercise: load, scrub/play, viewport modes, hover/tooltip, hide tickers, compare if practical.  
3. Log findings in this repo under e.g. `plans/C19-dogfood-notes.md` (or a dated section in this plan):
   - Adapter assumptions that held  
   - Bugs / API friction found  
   - Chart-package fixes applied (if any) before publish  
4. **Do not** merge host `master` as part of this unit.  
5. Optional: short “host recipe” snippet in README or `docs/` (file: link + adapter sketch) — generic “host application” wording for scrubbed surfaces.

### D — Demo marketing surface (prefer before publish)

1. Land [C19.5](./C19.5-demo-ux-simplify.md) (Simple/Customize, closed snippet, Tail vs Full history) **before** or in the same publish push as the marketing Pages cut.  
2. Confirm packaging: `"files": ["dist"]` only — demo stays git/Pages-only (no tarball change).

### E — Publish

1. Confirm CI green on `develop`.  
2. `npm run build` + pack dry-run sanity (`npm pack --dry-run` — expect `dist/` only).  
3. Deliberate `npm publish` (provenance if available).  
4. Restore npm version badge in README; update “Not published yet” copy.  
5. Tag release if that matches repo practice.

### F — Tests / docs hygiene

- No new production chart logic required unless dogfood finds bugs.  
- If dogfood forces a chart fix: Vitest in the same change (repo rule).  
- Update overview checkmarks when the unit completes.

---

## Acceptance criteria

- [ ] D1–D5 honored in README / changelog / process  
- [ ] README: rotation pitch; precise quadrant wording; enumerated fragile surfaces  
- [ ] `[0.1.0]` (or publish version) CHANGELOG accurately describes shipped API  
- [ ] Real-data dogfood notes committed (worked / broke / fixed)  
- [ ] [C19.5](./C19.5-demo-ux-simplify.md) done (or explicitly deferred with reason — prefer done before publish)  
- [ ] Pack dry-run confirms `dist/` only (demo not in tarball)  
- [x] Prefer [C20](./C20-bundle-size-perf-playbook.md) bundle-size tracking landed (or explicitly deferred with reason)  
- [ ] Host default branch still untouched by this unit  
- [ ] Package published to npm; README install + badges updated  
- [ ] Vitest green; typecheck/lint/build green if touched  

---

## Out of scope

- Package rename  
- G2 trail/hybrid mode  
- Host `master` C10 merge  
- Docs site  
- Perf LOD / C17 matrix expansion  
- Publishing `demo/` (already correctly excluded via `files: ["dist"]`)  

---

## Suggested files

| Area | Likely touch |
|------|----------------|
| Docs | `README.md`, `CHANGELOG.md`, `plans/C19-dogfood-notes.md` |
| Demo | via [C19.5](./C19.5-demo-ux-simplify.md) |
| Overview | `plans/00-overview.md`, this plan status |
| Publish | `package.json` version if bumping; npm auth (human) |
| Host (dogfood only) | Consumer feature branch — notes only required in *this* repo |

---

## Follow-ups after C19

1. Optional host recipe polish / example  
2. Revisit C17 profiles with real host sizes once dogfood logs exist  
3. Hybrid/trails (G2) **only** if demand appears — not scheduled  

---

## Cross-refs

- Scrutiny: [C19-public-library-scrutiny.md](./C19-public-library-scrutiny.md)  
- Demo UX: [C19.5-demo-ux-simplify.md](./C19.5-demo-ux-simplify.md)  
- Bundle size / playbook: [C20-bundle-size-perf-playbook.md](./C20-bundle-size-perf-playbook.md)  
- Deep profiling (deferred): [C21-deep-profiling.md](./C21-deep-profiling.md)  
- Pre-npm polish: [C18-pre-npm-polish.md](./C18-pre-npm-polish.md)  
- Host integration: [C10-host-integration.md](./C10-host-integration.md)  

---

## Revision log

| Date | Note |
|------|------|
| 2026-07-25 | Unit drafted from locked scrutiny feedback (D1–D5 + changelog + dogfood-before-publish) |
| 2026-07-25 | Added C19.5 demo UX sequencing + packaging `files: ["dist"]` confirmation |
| 2026-07-25 | Cross-link C20 bundle/playbook; prefer before publish; C21 profiling deferred |
