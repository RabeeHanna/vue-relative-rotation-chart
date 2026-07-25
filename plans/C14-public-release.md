# C14: Public Release Hygiene

**Phase:** Packaging / Trust  
**Estimate:** 1–2 days  
**Depends on:** C13 (+ C13.5 session persistence recommended)  
**Suggested schedule:** After C13 / C13.5; before first public npm release; **before** [C15](./C15-tail-hover.md)  
**Priority:** Standard for public launch; **not** required for Sector Orbit file: linking  
**Status:** Complete (implementation + unit tests)

---

## Goal

Make the package trustworthy and installable as a public Vue 3 library: packaging correctness, trust signals, CI gates, deployed demo, and an optional scenarios export subpath for copy-as-code imports from [C13](./C13-demo-playground.md).

---

## Sequence

```
C13 demo playground (implement)
  → C14 packaging / CI / trust (this unit)
  → Decide docs site (VitePress / Histoire) vs polished demo-only for v1 launch
```

A separate docs site is **not** a release blocker. Many Vue component libraries ship with a strong demo + README first.

---

## Packaging Checklist

- [x] `package.json` `exports` map with proper ESM entry  
- [x] `files: ["dist"]` only — no source, tests, or demo in the npm tarball  
- [x] Ship generated `.d.ts` from build (`vite-plugin-dts`) — not hand-written  
- [x] D3 via submodules only (`d3-scale`, `d3-shape`, `d3-array`, `d3-axis`) — not full `d3`  
- [x] **Vue as peerDependency only** — removed from `dependencies` (kept in `devDependencies` for local demo/tests)  
- [x] Export **`vue-relative-rotation-chart/scenarios`** subpath with named fixtures (`denseCluster`, `defaultScenario`, `scenarioFixtures`, …)

```ts
import { denseCluster } from 'vue-relative-rotation-chart/scenarios'
// default scenario id → defaultScenario (reserved word)
import { defaultScenario as series } from 'vue-relative-rotation-chart/scenarios'
```

Scenario modules remain **demo/fixture data only** — no Sector Orbit types, no fetch. Fixtures live under `src/scenarios/`; demo catalog metadata stays in `demo/scenarios.ts`.

---

## Trust Signals

- [x] `LICENSE` — MIT  
- [x] `CONTRIBUTING.md`  
- [x] `SECURITY.md`  
- [x] README badges: npm version, bundle size (bundlephobia), license, CI status (replace `OWNER` in badge URLs when the GitHub remote exists)  
- [x] Changelog discipline — Keep a Changelog + conventional commits (`CHANGELOG.md`)  
- [x] Semver policy documented in README  

---

## CI

- [x] PR gate: `typecheck` + `lint` + `npm test` + `npm run test:e2e` (+ `build`) — `.github/workflows/ci.yml`  
- [x] Deploy public demo workflow — `.github/workflows/deploy-demo.yml` (`npm run build:demo` → GitHub Pages)  
- [x] `npm publish` via CI with **provenance attestation** — `.github/workflows/publish.yml` (`workflow_dispatch`; requires `NPM_TOKEN` + trusted publishing setup)  

### npm publish (owner note) — DEFERRED

**Do not publish to npm yet.** Packaging + publish workflow are ready, but the first `npm publish` is intentionally delayed until pre-npm polish ([C18](./C18-pre-npm-polish.md)) and preferably [C10](./C10-host-integration.md) confidence. Consumers should use `file:` / git / workspace links until then.

### Demo URL (owner note)

- Repo: https://github.com/RabeeHanna/vue-relative-rotation-chart  
- Live demo: https://rabeehanna.github.io/vue-relative-rotation-chart/ (GitHub Pages via `deploy-demo.yml`)

---

## Docs (decision recorded)

**Ship demo-only for v1** — polished Vite playground + README. VitePress / Histoire **not** scheduled for first public tag; revisit after C15/C16 if adoption needs a docs site.

---

## Out of Scope

- Host application feature-flag integration ([C10](./C10-host-integration.md))  
- Changing chart rendering behavior  
- Mandatory docs site before first tag  

---

## Acceptance Criteria

- [x] Packaging checklist items verified or fixed  
- [x] Trust files + README badges present  
- [x] CI gates defined for PRs  
- [x] Demo deploy workflow present; live demo linked (GitHub Pages)  
- [x] Scenarios subpath in scope: export works from library build / `npm pack`  
- [x] Docs-site decision recorded (demo-only for v1)  
- [x] npm publish **deferred** by owner decision (workflow ready; not executed)

---

## Cross-refs

- Packaging order: [C14](./C14-public-release.md) → [C15](./C15-tail-hover.md) → [C10](./C10-host-integration.md) (deferred)  
- Demo copy-as-code / fixtures: [C13](./C13-demo-playground.md)  
- Overview order: [00-overview](./00-overview.md)  
