# C26 — npm pack consumer CI

## Status

**Complete** (2026-07-30)

## Goal

Verify the published tarball installs and builds in a clean Vue consumer; block publish without built `dist/`.

## Delivered

- `scripts/prepack-check.mjs` + `prepack` script
- `tests/pack/packConsumer.test.ts` — tarball contents + consumer fixture build
- CI runs pack consumer tests after build (`ci.yml`)

## Acceptance criteria

- [x] `prepack` fails without complete `dist/`
- [x] Packed tarball contains JS, types, CSS, scenarios
- [x] Consumer fixture typechecks and `vite build` from `.tgz`
- [x] CI runs pack tests after build

## Note

**0.1.4** published manually (interactive `npm login` + publish). GHA publish workflow removed; see [`docs/publish.md`](../../docs/publish.md).
