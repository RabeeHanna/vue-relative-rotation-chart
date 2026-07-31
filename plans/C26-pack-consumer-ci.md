# C26 — npm pack consumer CI

## Status

**Complete** (2026-07-30)

## Goal

Verify the published tarball installs and builds in a clean Vue consumer; block publish without built `dist/`.

## Delivered

- `scripts/prepack-check.mjs` + `prepack` script
- `tests/pack/packConsumer.test.ts` — tarball contents + consumer fixture build
- CI and publish workflows run pack consumer tests after build

## Acceptance criteria

- [x] `prepack` fails without complete `dist/`
- [x] Packed tarball contains JS, types, CSS, scenarios
- [x] Consumer fixture typechecks and `vite build` from `.tgz`
- [x] Publish workflow runs pack tests before `npm publish --provenance`

## Note

npm provenance for **0.1.3** was published without attestations. Future releases via GHA publish workflow restore provenance.
