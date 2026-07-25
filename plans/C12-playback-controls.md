# C12: Playback Controls

**Phase:** Interaction  
**Estimate:** 1–2 days  
**Depends on:** C4 complete (renderable chart to drive); independent of C5–C6 label/tail work  
**Suggested schedule:** After C7 (or in parallel with C7). Ideal earliest slot was after C4 — those units are already done.  
**Priority:** Standard — addresses Sector Orbit “ambiguous playback controls” UX issue  
**Status:** Complete

---

## Goal

Extend the chart’s `selectedDate` contract into a **controlled playback system**: play/pause, step, scrub, speed, and keyboard controls as a separate component that emits date changes and does not own chart rendering.

Replaces Sector Orbit’s ambiguous playback controls with an unambiguous, testable timeline UI.

---

## Why Separate from `RrgChart`

Keeps the chart a pure renderer (core package principle). Playback is a timeline concern — parents can swap a compact/mobile control later without touching SVG rendering.

```vue
<RrgChart
  :series="series"
  :selected-date="selectedDate"
  ...
/>
<RrgPlaybackControls
  :dates="availableDates"
  :selected-date="selectedDate"
  :playing="isPlaying"
  :speed="playbackSpeed"
  @update:selected-date="selectedDate = $event"
  @update:playing="isPlaying = $event"
  @update:speed="playbackSpeed = $event"
/>
```

---

## Scope

### In scope
- Play / pause toggle
- Step forward / step backward (single frame)
- Scrubber (draggable timeline, jump to any date)
- Playback speed control
- Current date / frame position indicator
- Loop behavior at end of range
- Keyboard controls
- Emits date changes; does not own chart rendering

### Out of scope
- Fetching or generating the date range (parent supplies `dates`)
- RRG calculation
- Persisting playback state across sessions
- Multi-chart synchronized playback (future)
- Variable frame durations (uniform speed in v1)

---

## Public Types

Add to `src/types/rrg.ts` and export from `src/index.ts`:

```ts
export type RrgPlaybackControlsProps = {
  dates: string[]              // ordered ascending
  selectedDate: string         // must be a member of `dates` (or snapped — see edge cases)
  playing?: boolean            // default: false
  speed?: number               // frames per second, default: 2
  minSpeed?: number            // default: 0.5
  maxSpeed?: number            // default: 8
  loop?: boolean               // default: true
}

export type RrgPlaybackControlsEmits = {
  'update:selectedDate': [date: string]
  'update:playing': [playing: boolean]
  'update:speed': [speed: number]
}
```

Vue `v-model:selected-date` / `v-model:playing` / `v-model:speed` compatible.

---

## UI Requirements

Non-ambiguity rule: at a glance, a user must answer “is it playing?”, “where am I?”, and “how fast?” without hovering.

| Element | Requirement |
|---------|-------------|
| Play/Pause | Single toggle; icon ▶ / ⏸ from `playing` |
| Step | ⏮ / ⏭; disabled at boundaries unless `loop` |
| Scrubber | Full-range track; live drag; click-to-jump |
| Date label | Always-visible text date (e.g. `2026-06-15`) |
| Frame position | Optional “Frame 42 of 120” |
| Speed | Visible (e.g. `2x`) with adjust — not buried in a menu |
| Loop | Subtle affordance when `loop` is true |

---

## Interaction Requirements

### Play / Pause
- Toggle emits `update:playing`
- While playing, advance one frame every `1000 / speed` ms
- Last frame + `loop: false`: play is a no-op until scrubbed back
- Last frame + `loop: true`: restart from first date

### Stepping
- ±1 index in `dates`
- Stepping while playing **pauses first**
- Disabled (not hidden) at boundaries when `loop: false`

### Scrubbing
- Live `selectedDate` updates while dragging
- Scrubbing pauses playback
- Must not jitter the chart (reuse C8 replay-stability expectations)
- Handle position is smooth; chart updates may be throttled under rapid drag (see edge cases)

### Speed
- Changes apply immediately mid-playback
- Clamped to `[minSpeed, maxSpeed]`
- Default **2 fps** (readable rotation)

### Keyboard (when focused)

| Key | Action |
|-----|--------|
| Space | Toggle play/pause |
| ← / → | Step back / forward |
| Home / End | First / last date |

---

## State Ownership

**Fully controlled** — `selectedDate`, `playing`, and `speed` are props + update emits.

Internal only:
- Scrub-drag transient state
- `requestAnimationFrame` playback loop (timestamp-delta; clean up on pause/unmount; no catch-up when tab backgrounded)

---

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty `dates` | Controls disabled; no throw |
| Single date | Play/step/scrub disabled; label shows that date |
| `selectedDate` ∉ `dates` | Snap to nearest; emit corrected `update:selectedDate` |
| Speed out of range | Clamp silently |
| Unmount while playing | Cancel rAF; no update-after-unmount |
| Tab backgrounded | rAF throttles; resume without catching up missed frames |
| Rapid scrub | Scrubber smooth; chart updates throttled/debounced |

---

## Accessibility

- Play/pause `aria-label` reflects state (“Play” / “Pause”)
- Scrubber `role="slider"` with `aria-valuemin` / `max` / `now` / `valuetext` (readable date)
- All controls Tab-reachable
- Keyboard shortcuts noted in accessible summary

---

## Files to Add

```
src/components/RrgPlaybackControls.vue
src/composables/useRrgPlayback.ts   # optional: frame index / rAF loop helpers
tests/RrgPlaybackControls.test.ts
tests/e2e/playback.spec.ts          # with C9 Playwright setup, or later
demo/DemoApp.vue                    # wire controls beside chart
```

Export `RrgPlaybackControls` from `src/index.ts`.

---

## Testing

### Unit
- Frame advancement (index math, loop wrap)
- Speed clamping
- Date-not-in-range snapping
- Cleanup on unmount

### Playwright (when e2e harness exists)
- Play advances date over time
- Step ±1 frame
- Scrubber click/drag
- Keyboard shortcuts when focused
- Loop vs boundary behavior

### Adversarial / manual
- At `maxSpeed`, chart must not break (readability may suffer)
- Cold check: can a first-time user tell playing / speed / position with no explanation?

---

## Acceptance Criteria

- [x] Play/pause is a single unambiguous toggle
- [x] Current date always visible as text
- [x] Speed visible and adjustable without a hidden menu
- [x] Scrubbing does not cause chart jitter
- [x] Fully controlled (props + emits)
- [x] Keyboard controls work
- [x] Playback loop cleans up on unmount and pause
- [x] Section edge cases verified
- [x] Resolves Sector Orbit “ambiguous playback controls” complaint
- [x] Unit tests green; exported from package entry

---

## Cross-refs

- Chart frame prop: [`C2-types.md`](./C2-types.md) (`selectedDate`)
- Replay stability: [`C8-viewport.md`](./C8-viewport.md)
- Sector Orbit wiring: [`C10-sector-orbit-integration.md`](./C10-sector-orbit-integration.md) — prefer `RrgPlaybackControls` over legacy ambiguous slider when integrating
- A11y/e2e: [`C9-accessibility.md`](./C9-accessibility.md)
