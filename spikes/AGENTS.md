# spikes

## Purpose

Throwaway prototypes that de-risk algorithms before production code.

## Belongs here

- Short-lived algorithm experiments and SVG artifacts
- Future spikes that must not leak into the public API

## Does not belong here

- Exported package modules
- Long-lived production implementations (graduate into `src/` when ready)

## Depends on

- Vitest (and minimal tooling only)

## Used by

- Research and de-risking before production implementation
