# C29 — Standalone host decoupling (scrub Sector Orbit references)

## Status

**Ready** — next library maintenance unit

## Branch

`feature/C29-standalone-host-decoupling` from latest `develop`

## Goal

`vue-relative-rotation-chart` is a **standalone public package**. Sector Orbit is one consumer — the dependency arrow is host → library, not the reverse. This unit removes remaining Sector Orbit–specific branding, paths, and “dogfood host” framing from the VRRC repo so newcomers see a generic chart library first.

Historical plan files may retain brief archival notes where needed, but **user-facing surfaces** and **active docs** must not read like an internal Sector Orbit submodule.

## Depends on

- C27 reciprocal discoverability — **Complete** (intentionally added SO links; this unit reverses that policy on public surfaces)
- Sector Orbit Unit 235 — host C23 adoption complete (no further VRRC API needed from SO)

## Background

C27 shipped reciprocal links in `README.md` and `index.html` and allowlisted them in `tests/publicSurface.scrub.test.ts`. Many completed plans (`C10`, `C12`, `C22`, `C23`, …) still name Sector Orbit paths and units. That was useful during extraction; it is now noise for npm consumers.

**Keep in Sector Orbit (not here):** links to VRRC demo, npm, GitHub — already in SO footer/README.

## Scope

### Must scrub (user-facing / CI-gated)

| Area | Today | Target |
|------|-------|--------|
| `README.md` | Sector Orbit example app links | Generic “host application” + link to **this repo’s demo** only |
| `index.html` (demo shell) | Sector Orbit example link | Demo-only; optional “built with” generic copy |
| `CHANGELOG.md` | SO discoverability bullets | Neutral wording |
| `docs/publish.md`, `docs/agent-visual-qa*.md` | SO unit refs | “Host app” / “consumer” |
| `.cursor/skills/agent-visual-qa/SKILL.md` | SO skill cross-ref | VRRC-only scope |
| `tests/discoverability.demoShell.test.ts` | Asserts `sector-orbit-web.onrender.com` | Assert demo/npm links only |
| `tests/publicSurface.scrub.test.ts` | Allowlists README, index.html, CHANGELOG | **Remove allowlist** for brand strings; extend gate to `plans/` active sections if feasible |

### Plans / history (archive hygiene)

| Approach | Files |
|----------|-------|
| **Rewrite active headers** to generic host language | `C23`, `C22`, `C12`, `C10`, `C24`, `00-overview.md` implementation order bullets |
| **Leave historical decision records** with one-line “archived: was Sector Orbit dogfood” where rewrite would lose context | `C19-dogfood-notes.md`, completed PRE-C1 docs |
| **Add note at top of C27** | Superseded by C29 policy — links removed |

Do **not** delete completed plan files; reduce brand density and remove `sector-orbit/plans/...` path pointers from “next steps” sections.

### Explicitly out of scope

- Changing public API or component behavior
- Removing generic terms: “host”, “consumer”, “RRG-style”, “ETF rotation”
- Sector Orbit repo changes (SO keeps its VRRC links)
- npm version bump unless copy changes warrant a patch release note

## Acceptance criteria

- [ ] `rg -i 'sector.orbit|sector-orbit|SectorOrbit' README.md index.html CHANGELOG.md docs/ src/ demo/ tests/` — **no matches** (except scrub test allowlist comment if kept)
- [ ] `npm test` green including updated `publicSurface.scrub.test.ts`
- [ ] README positions package standalone: demo URL, npm install, minimal host snippet — no named consumer app
- [ ] `plans/00-overview.md` lists C29 complete; no “Sector Orbit should …” in pending work bullets
- [ ] Optional: `npm run build` + `npm run check:bundle-size` unchanged

## Suggested execution order

1. Inventory: `rg -i 'sector.orbit|sector-orbit|SectorOrbit' .` and classify (scrub / archive / keep)
2. Rewrite README + demo shell + docs
3. Tighten scrub test (drop README/index.html/CHANGELOG allowlist; add `docs/` if missing)
4. Sweep plan files — genericize active refs; mark C27 superseded
5. Run full test + typecheck; single squashed commit on `develop`

## Cross-refs

- Sector Orbit: `plans/236-discoverability-closeout.md` (SO → VRRC links stay there)
- Prior: [C27](./C27-reciprocal-discoverability.md) (reciprocal links — reversed by this unit)
- [C18](./C18-pre-npm-polish.md) brand scrub patterns
