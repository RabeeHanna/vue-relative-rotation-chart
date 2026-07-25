# vue-relative-rotation-chart

A Vue SVG component for rendering RRG-style relative rotation charts from precomputed relative strength and momentum data.

This package is a **renderer only** — it does not fetch data or perform RRG calculations. Callers must pass precomputed series props.

See [`plans/00-overview.md`](./plans/00-overview.md) for units of work and implementation order.

Install (Sector Orbit workspace link, for now):

```json
{
  "dependencies": {
    "vue-relative-rotation-chart": "file:../vue-relative-rotation-chart"
  }
}
```

Scaffolding and public API land in later units (C1+). Pre-start spikes live under `spikes/` and `plans/`.
