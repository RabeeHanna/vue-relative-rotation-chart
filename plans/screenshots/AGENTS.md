# screenshots

## Purpose

Review artifacts for adversarial / pre-npm visual checks: PNG captures plus per-scenario debug JSON from the demo.

## Belongs here

- Numbered review screenshots (`01–09.png`) from `npm run review:artifacts`
- Matching `*.json` debug sidecars (selected date, status, viewport, point count)

## Does not belong here

- Source code, unit fixtures, or spike algorithm artifacts

## Depends on

- Demo scenarios in `demo/scenarios.ts` (C11/C13 fixtures; `adversarialMocks.ts` re-exports)
- Playwright review config (`playwright.review.config.ts`)

## Used by

- [C11 adversarial review](../C11-adversarial-review.md)
- [C18 pre-npm polish](../C18-pre-npm-polish.md)
