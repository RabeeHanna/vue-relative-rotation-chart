# C22: Mobile Playback Polish

**Phase:** Interaction / Polish  
**Estimate:** 1–2 days  
**Depends on:** C12 complete (`RrgPlaybackControls` shipped)  
**Priority:** Standard — unblocks Sector Orbit mobile UX without duplicating scrubber work in the host  
**Status:** Pending

---

## Goal

Make `RrgPlaybackControls` (scrubber, transport, speed, date label) usable on phone-width viewports. Host apps should not maintain a parallel replay bar for mobile touch targets.

Sector Orbit today still uses a custom `ChartReplayBar.vue` with a native `<input type="range">`. C10 wired `RrgChart` only; playback should move to the library component per [C12](./C12-playback-controls.md).

---

## Scope

### In scope

- Responsive layout for `RrgPlaybackControls` (stack/wrap ≤600px; no horizontal overflow at 390px)
- Larger touch hit targets for transport buttons and scrubber thumb/track
- Scrubber drag usability on touch (no jitter; reuse `useScrubDatePreview` / coalesce)
- Optional compact mode prop (icon-only transport, shorter meta row) if needed for narrow widths
- Dark theme styles verified on mobile breakpoints
- Playwright or Vitest + layout assertions at **390×844** (library package tests)
- Demo playground shows controls beside chart at mobile viewport

### Out of scope

- Host app sidebar / controls panel layout (Sector Orbit **234** app-shell slice)
- URL replay state, benchmark context line, frame prices (host concerns)
- Fetching `dates` or owning session persistence

---

## Host follow-up (Sector Orbit, not this unit)

After C22 ships:

1. Replace `ChartReplayBar.vue` with `RrgPlaybackControls` from `vue-relative-rotation-chart`
2. Map `dates` + `selectedDate` ISO from existing URL/session state (`date=start` / `latest` / ISO)
3. Drop duplicate replay transport helpers where the library covers them (`replayTransport`, custom slider CSS)
4. Keep host-only meta (benchmark close, interval) **below** or **beside** library controls if still needed — not inside the scrubber component

---

## Acceptance criteria

- [ ] `RrgPlaybackControls` usable at 390px width without horizontal scroll
- [ ] Scrubber thumb/track meet minimum touch target guidance (~44px where practical)
- [ ] Transport + scrubber covered by package tests at mobile viewport
- [ ] Demo documents mobile-friendly wiring pattern
- [ ] Sector Orbit can delete custom scrubber once host migration is done (separate host PR)

---

## Cross-refs

- Playback API: [C12](./C12-playback-controls.md)
- Host chart wiring: [C10](./C10-host-integration.md)
- Sector Orbit app-shell mobile: `sector-orbit/plans/234-mobile-layout-polish.md`
