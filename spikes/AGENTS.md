# spikes

## Purpose

Throwaway prototypes that de-risk algorithms before production code.

## Belongs here

- Label-collision spike (`label-collision/`) and SVG artifacts
- Future spikes that must not leak into the public API

## Does not belong here

- Exported package modules
- Long-lived production implementations (graduate into `src/` in the owning unit)

## Depends on

- Vitest (and minimal tooling only)

## Used by

- PRE-C1 / research units; referenced by later implementation plans
