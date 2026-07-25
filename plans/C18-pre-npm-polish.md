# C18: Pre-npm Polish — Review Artifacts + Public API / Docs

**Phase:** Polish / Trust (pre-publish)  
**Estimate:** 2–3 days  
**Depends on:** [C14](./C14-public-release.md), [C11](./C11-adversarial-review.md) screenshot harness, [C17](./C17-performance-profiling.md) complete  
**Suggested schedule:** After C17; **before** [C10](./C10-host-integration.md) and before first npm publish  
**Priority:** High for publish readiness; not required for local `file:` use  
**Status:** Complete — awaiting unit commit  

---

## Goal

Close the gap between “CI + demo exist” and “safe public / pre-npm repo”: honest README, predictable public chart behavior, remove day-one deprecated props, demo defaults that feel finished, dark-theme polish, a **public-surface scrub** (no private consumer brand / inappropriate content), and `review:artifacts` (screenshots + debug JSON).

**Not in scope:** `npm publish`; VitePress/Histoire; host-app feature-flag wiring ([C10](./C10-host-integration.md) — next after this unit).

---

## Already present (do not rebuild)

| Piece | Where |
|-------|--------|
| Playwright smoke | `tests/e2e/chart.spec.ts` → `npm run test:e2e` (CI) |
| Adversarial screenshots | `npm run review:screenshots` → `plans/screenshots/01–09.png` |
| Perf FPS harness | `npm run test:perf` (C17; separate) |
| `snapDateIndex` helper | `src/utils/playback.ts` (extend for chart date resolve) |
| Dark theme tokens | `demo/demoThemeCss.ts` currently `#1a1a2e` blue-black — **replace in this unit** |

C18 **extends** review screenshots into artifacts + applies API/docs/demo decisions below.

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| Badges | **Remove** npm version + Bundlephobia badges until publish. Keep CI + license. Install: “Not published to npm yet.” |
| `selectedDate` mismatch | **Snap** to nearest series date (`snapDateIndex`). Empty series / no dates → **empty-state** (visible, testable). JSDoc + `data-date-status="exact\|snapped\|empty"` (or equivalent). |
| `showPatterns` | **Remove** from public API, defaults, demo URL/session, tests, docs. |
| `showTailFade` | Package + demo default stay **`false`** (do not flip). |
| Playback visual labels | Prop e.g. `labelStyle?: 'icon' \| 'icon-text'` (default `'icon'`). Icon-text uses `copy` strings; icon-only keeps `aria-label` + `title`. |
| Demo theme | **Dark is default** (`theme=dark` when URL/session omit theme). |
| Dark palette | Replace blue-black (`#1a1a2e` / related) with **dark grey** background; chart lines/labels/grid **whiter** (higher contrast on grey). Update `demoThemeCss` + component `.dark` CSS vars as needed. |
| Demo playback on load | Scrubber at **start** (first date); **loop on**; **playing** already running. Persist sensibly with session (first visit / no saved date → start + play). |
| Docs | Real minimal `series` example; prop/event tables; strong renderer-only warning; no private consumer brand in README. |
| Review artifacts | `npm run review:artifacts` (+ alias `review:screenshots`): PNGs + per-scenario debug JSON. |
| Public repo scrub | Full inspection + cleanup — see § Public surface scrub. |

---

## Public surface scrub

### Intent

This repo should read as a **standalone open-source chart package**, not an internal extract. Run a full-repo inspection and remove or rewrite anything inappropriate for a public GitHub repo.

### Forbidden on public surfaces (hard)

Strings / concepts that must **not** appear in shipped or visitor-facing trees:

- Brand / product: `Sector Orbit`, `sector orbit`, `SectorOrbit`, `sector-orbit`, `sector_orbit`
- App-specific types or paths leaked from a private consumer
- Secrets, tokens, private URLs, machine-specific absolute paths, internal-only credentials

**Trees (hard gate — add Vitest scrub test):**

- `src/`
- `demo/`
- `tests/` (except an allowlist comment inside the scrub test itself listing forbidden patterns)
- `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `LICENSE` (if applicable)
- `package.json` description / keywords
- Root `AGENTS.md` consumer wording → generic (“host application” / `file:` link)

### Plans / roadmap (soft rewrite)

- Prefer **“host application”** / **“primary consumer”** in overview and unit plans instead of a private product name.
- [C10](./C10-host-integration.md): keep as the **integration unit** but rename file/title narrative to host-app integration during C18 if residual brand strings remain; content stays “work happens in the consumer repo.”
- Historical decision logs may note “original consumer” only if unavoidable — prefer scrub.

### Also remove / sanitize if found

- Commented-out dead code tied to a private app
- Internal Slack/ticket IDs, personal emails beyond intentional maintainer contact
- Screenshot or fixture names that encode private product branding
- Docs that instruct committers to couple this package to a private monolith

### Acceptance for scrub

- [ ] Repo-wide search documented in PR / results note (hits → fixed or justified allowlist)
- [ ] Automated test fails CI if forbidden brand strings reappear under hard-gate paths
- [ ] README / CONTRIBUTING / demo copy are generic

---

## Workstreams

### A — Review artifacts

1. Extend adversarial screenshot spec to dump JSON beside each shot.  
2. `review:artifacts` script; `review:screenshots` alias.  
3. Core scenarios 01–09 (+ optional capped long-playback).  
4. Update screenshots / review-artifacts AGENTS.

### B — Public API cleanup

1. Remove `showPatterns` end-to-end.  
2. Keep `showTailFade` default **false**.  
3. Chart date snap + empty state + tests.  
4. Playback `labelStyle` + Vitest.  
5. Types JSDoc: predictable degradation, not “undefined rendering.”

### C — Demo defaults & dark theme

1. Default theme **dark**; URL parse: omit → dark (not light).  
2. Dark grey bg + whiter label/grid/axis/tail treatment (`demoThemeCss.ts`, `RrgChart.css` / playback dark).  
3. On load: `selectedDate` = **first** timeline date; `playbackLoop` true; `playing` true.  
4. Session merge: respect saved state when present; first-run defaults as above.  
5. Update demo/session/URL tests + e2e that assumed light or end-of-timeline.

### D — Docs / README

1. Badge fix + not-published wording.  
2. Minimal real data example; prop/event tables; renderer-only.  
3. Generic install (`file:` / git) — no private product name.  
4. Scripts: `review:artifacts`, `test:perf`.  
5. CHANGELOG Unreleased.

### E — Public surface scrub

1. Full-repo grep inventory.  
2. Rewrite/remove hits per § Public surface scrub.  
3. Add `tests/publicSurface.scrub.test.ts` (or similar).  
4. Retitle/reword plans as needed (including C10 naming if required).

### F — Tests

- Unit: snap, empty state, patterns gone, fade still defaults false, playback labelStyle, theme/playback demo defaults, scrub test.  
- E2e smoke green; artifacts runnable locally.

---

## Acceptance criteria

- [x] Locked decisions honored (including **tail fade false**, **dark default**, **grey dark theme**, **play from start + loop**)  
- [x] `npm run review:artifacts` → screenshots + debug JSON  
- [x] Badges / install honesty  
- [x] `showPatterns` removed  
- [x] `selectedDate` snap / empty-state tested  
- [x] Playback visual label option  
- [x] README: real example + tables + renderer-only; no private brand  
- [x] Public scrub + automated hard-gate test green  
- [x] Vitest + e2e smoke green  
- [x] Overview → next is C10 (host integration)  

---

## Out of scope

- `npm publish`  
- Hit LOD / C17 matrix expansion  
- Implementing C10 in the consumer app  
- New docs site  

---

## Suggested files

| Area | Likely touch |
|------|----------------|
| Review | `tests/e2e/*`, `playwright.review.config.ts`, `package.json`, `plans/screenshots/` |
| API | `src/types/*`, `RrgChart.vue`, empty-state, date resolve util |
| Playback | `RrgPlaybackControls.vue` + CSS |
| Demo | `demoThemeCss.ts`, session/URL/defaults, `useDemoAppState`, App CSS |
| Chart dark | `RrgChart.css`, playback dark vars |
| Scrub | README, CONTRIBUTING, AGENTS, plans wording, `tests/publicSurface.scrub.test.ts` |

---

## Follow-ups after C18

1. **C10** — host application feature-flag integration  
2. Revisit C17 P0–P3 with real host sizes  
3. First deliberate npm publish  

---

## Cross-refs

- C11 screenshots: [C11-adversarial-review.md](./C11-adversarial-review.md)  
- C14 packaging: [C14-public-release.md](./C14-public-release.md)  
- C17 perf: [C17-performance-profiling.md](./C17-performance-profiling.md)  
- Order: C17 → **C18** → **C10** ([host integration](./C10-host-integration.md))

---

## Revision log

| Date | Note |
|------|------|
| 2026-07-25 | Initial draft |
| 2026-07-25 | Locked: keep `showTailFade` false; demo start+loop+playing; dark default; grey dark theme + whiter chrome; full public-surface / brand scrub |
| 2026-07-25 | Implementation: API snap/empty, patterns removed, labelStyle, demo defaults, artifacts, scrub, README |
