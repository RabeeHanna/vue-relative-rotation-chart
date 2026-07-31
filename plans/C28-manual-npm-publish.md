# C28 — Manual npm publish playbook

## Status

**Complete** (2026-07-30)

## Goal

Document and enforce manual-only npm publish after npm deprecates GHA/OIDC publish paths for this account.

## Delivered

- Removed `.github/workflows/publish.yml`
- Added [`docs/publish.md`](../../docs/publish.md) — login (browser / QR / Face ID), preflight, publish
- Updated [`CONTRIBUTING.md`](../../CONTRIBUTING.md) branch + release section

## Acceptance criteria

- [x] No GHA workflow attempts `npm publish`
- [x] Maintainer playbook describes interactive login flow
- [x] Pack-consumer CI remains on `ci.yml`
