# C14: Public Release Hygiene

**Phase:** Packaging / Trust  
**Estimate:** 1–2 days  
**Depends on:** C13 demo playground implemented (or at least scenario fixtures stable)  
**Suggested schedule:** After C13 implementation; before first public npm release  
**Priority:** Standard for public launch; **not** required for Sector Orbit file: linking  
**Status:** Planned (checklist stub)

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

Already largely true — verify and close gaps:

- [ ] `package.json` `exports` map with proper ESM entry (present today)  
- [ ] `files: ["dist"]` only — no source, tests, or demo in the npm tarball (present today)  
- [ ] Ship generated `.d.ts` from build (`vite-plugin-dts`) — not hand-written  
- [ ] D3 via submodules only (`d3-scale`, `d3-shape`, `d3-array`, `d3-axis`) — not full `d3`  
- [ ] **Vue as peerDependency only** — remove from `dependencies` if still duplicated  
- [ ] Optional: export **`vue-relative-rotation-chart/scenarios`** subpath with named fixtures (`denseCluster`, `default`, …) so C13 copy-as-code can use a real import line  

```ts
// Target copy-as-code companion (after this subpath exists)
import { denseCluster } from 'vue-relative-rotation-chart/scenarios'
```

Scenario modules must remain **demo/fixture data only** — no Sector Orbit types, no fetch.

---

## Trust Signals

- [ ] `LICENSE` — MIT (aligns with public-safe positioning)  
- [ ] `CONTRIBUTING.md`  
- [ ] `SECURITY.md` (vuln reporting)  
- [ ] README badges: npm version, bundle size (bundlephobia), license, CI status  
- [ ] Changelog discipline — Changesets **or** conventional commits + generated CHANGELOG  
- [ ] Semver policy documented in README (public API may change pre-1.0; v1 still renderer-only)

---

## CI

- [ ] PR gate: `typecheck` + `lint` + `npm test` + `npm run test:e2e`  
- [ ] Deploy public demo (GitHub Pages or Vercel) linked from README — “try it live”  
- [ ] `npm publish` via CI with **provenance attestation** when ready to publish  

---

## Docs (post-C14 decision)

Not part of the minimum C14 acceptance set:

- VitePress site with live embedded examples (idiomatic Vue)  
- Histoire / Storybook-style isolated stories  

Decide after C13 + C14: polished playground alone may be enough for first public release.

---

## Out of Scope

- Sector Orbit feature-flag integration ([C10](./C10-sector-orbit-integration.md))  
- Changing chart rendering behavior  
- Mandatory docs site before first tag  

---

## Acceptance Criteria

- [ ] Packaging checklist items verified or fixed  
- [ ] Trust files + README badges present  
- [ ] CI gates green on PRs  
- [ ] Demo deployed and linked (or explicitly deferred with owner note)  
- [ ] If scenarios subpath is in scope for the same release: export works from a clean `npm pack` install  
- [ ] Docs-site decision recorded (ship demo-only **or** schedule VitePress/Histoire)

---

## Cross-refs

- Demo copy-as-code / fixtures: [C13](./C13-demo-playground.md)  
- Overview order: [00-overview](./00-overview.md)  
