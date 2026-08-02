# C30 — Optional automatic control-config persistence

## Status

**Ready** — research / design unit (implementation may follow in C30.1)

## Goal

Investigate how `vue-relative-rotation-chart` can optionally persist **all control-surface configs** (viewport, display, visibility, and future knobs) so production hosts do not lose settings such as `labelMode` on refresh — **without** remembering to wire each new field into a cache list by hand.

This is a **library-only** unit. Host adoption (URL vs session vs library cache) is out of scope here except as a consumer feasibility note.

## Problem (observed)

- Demo already persists many controls via `demo/demoSession.ts` + URL (`labelMode`, `showTailFade`, `viewportMode`, …).
- Production hosts that only v-model library controls may persist a subset (tail, viewport) in their own session/URL and **omit** others (`labelMode`, `showTailFade`, visibility). Refresh resets those to defaults.
- Every new control today requires a host (or demo) to remember: URL key + session field + merge logic. That does not scale.

## Desired outcome

1. **Feasibility report** — can the library own optional persistence safely without becoming a host app store?
2. **Recommended design** — opt-in API (e.g. `persist-controls` / `cache-configs`) with a single schema so **new controls are auto-included**.
3. **Opt-out** — `persist-controls={false}` (default) preserves today’s behavior; no surprise writes to `sessionStorage`.
4. **Sketch of host interface** — how a host enables one prop and stops hand-maintaining per-field cache lists.

## Constraints

- Renderer-only boundary still holds: no price fetch, no RRG math, no host routing.
- Persistence is **UI preference** chrome, not chart data.
- Must not break controlled `v-model` usage (host remains source of truth when it passes models).
- Default **off** — library must not write storage unless the host opts in.
- Prefer `sessionStorage` (tab-scoped) as the default backend; document swap-in for `localStorage` if needed later.
- No host-specific types in the public API.

## Research tasks

| # | Task | Deliverable |
|---|------|-------------|
| R1 | Inventory every v-model / prop on `RrgChartControlsPanel`, `RrgPlaybackControls`, and related control components that a host might want restored | Table: field, type, default, current demo persist? |
| R2 | Compare demo session/URL approach vs a library-owned schema registry | Pros/cons; what breaks if library persists while host also persists |
| R3 | Design an **auto-extend** mechanism so adding a control field updates the persisted blob without a manual allowlist edit | Recommended: typed `RrgControlsPersistState` built from a single schema object / `defineControlsSchema()` used by panel + persist helper |
| R4 | Define conflict policy: URL / host props / session — who wins on load | Decision table (recommend: host props > URL if host owns URL > session > defaults) |
| R5 | API sketch: prop names, storage key, versioning, `persistControls={false}` | Short public-API proposal in this doc’s Acceptance |
| R6 | Feasibility: SSR / private mode / disabled storage | Graceful no-op |

## Proposed direction (hypothesis to validate)

```ts
// Single schema drives UI defaults + persistence keys
const RRG_CONTROLS_SCHEMA = {
  viewportMode: { type: 'enum', values: [...], default: 'fit' },
  labelMode: { type: 'enum', values: [...], default: 'auto' },
  tailLength: { type: 'number', default: 12 },
  showTailFade: { type: 'boolean', default: false },
  visibleTickers: { type: 'string[]', default: null }, // null = all
  // new fields append here → auto in persist read/write
} as const

// Host usage
<RrgChartControlsPanel
  persist-controls
  persist-key="my-app-rrg-controls"  // optional
  v-model:label-mode="labelMode"
  ...
/>
```

- When `persist-controls` is true, a small composable (`useRrgControlsPersist`) hydrates missing v-models from session on mount and writes on change.
- **Automatic inclusion:** persistence iterates `Object.keys(RRG_CONTROLS_SCHEMA)` — adding a schema entry is the only step for a new control (panel already binds it).
- Playback may be a **separate** schema (`RRG_PLAYBACK_PERSIST_SCHEMA`) so chart display prefs and transport state are not forced together.

## Out of scope for C30 (research)

- Implementing the composable (unless research proves a tiny spike is needed — keep under `spikes/` if so)
- Changing host URL state
- Persisting series data or selectedDate frame scrub position (optional follow-up; call out in R1)

## Acceptance criteria

- [ ] R1–R6 written up in this doc (or linked spike notes)
- [ ] Explicit **Go / No-go** on library-owned persistence
- [ ] If Go: recommended API + schema pattern + versioning (`persistVersion`)
- [ ] If Go: list of C30.1 implementation tasks (with file targets)
- [ ] Vitest cases listed for C30.1 (hydrate, write, opt-out, corrupt JSON, schema version mismatch)
- [ ] Note on how hosts that already use URL state should compose (library session as fallback only)

## Depends on

- C23 control panel surface (exists)
- Demo session persistence as reference (C13.5) — not a hard blocker

## Branch

`develop` (research doc); implementation branch only if C30.1 is approved
