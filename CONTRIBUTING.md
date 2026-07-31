# Contributing

Thanks for helping improve `vue-relative-rotation-chart`.

## Scope

This package is a **renderer only**. Do not add price fetching, RS-Ratio / RS-Momentum calculation, caching, or host-application shell / routing / store code.

## Workflow

1. Branch from `develop` (not `master`) for unit work.
2. Follow `plans/00-overview.md` — one unit of work per commit when implementing from `plans/`.
3. Keep Vue SFCs ≤ 200 lines and composables/utils/types ≤ 150 lines; split by responsibility when over.
4. Add or update Vitest coverage for production changes (`tests/`).
5. Before opening a PR, run:

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

## Branches and releases

| Branch | Role |
|--------|------|
| `develop` | Default branch — unreleased work and integration |
| `master` | Last **published** npm release (stable docs surface) |

Publishing:

1. Bump version on `develop`, merge to `master` at the release commit.
2. Tag `master` with `vX.Y.Z` matching `package.json`.
3. Create a GitHub Release from that tag.
4. **Publish manually from your machine** — see [`docs/publish.md`](./docs/publish.md).

npm publish is **interactive** (browser login, QR / Face ID or OTP). Do not use GitHub Actions for publish; the `Publish npm` workflow was removed.

Pre-publish checks (local or CI): `npm test` + `npm run build` + `npm test -- tests/pack/packConsumer.test.ts`.

Consumers trace npm → Git tag → `master` commit. `develop` may be ahead of npm.

## Layout

See root [`AGENTS.md`](./AGENTS.md) and directory `AGENTS.md` files for placement rules. Cursor rules live in `.cursor/rules/`.

## Performance

Chart smoothness and bundle-size checks: see [`docs/perf.md`](./docs/perf.md) (C17 FPS layers, C20 bundle ceilings, manual Chrome Performance steps). Lighthouse is not a chart FPS gate.

```bash
npm run test:perf          # Layer B — Chromium FPS (soft ≥55)
npm run build && npm run check:bundle-size
```

## Agent visual QA (demo UX)

Before demo layout or control polish PRs, run the agent loop or read the playbook:

- [`docs/agent-visual-qa.md`](./docs/agent-visual-qa.md)
- [`.cursor/skills/agent-visual-qa/SKILL.md`](./.cursor/skills/agent-visual-qa/SKILL.md)

Open `http://localhost:5173/?agent=1` for machine-readable state (`agent-state-panel`). **Always read full-page screenshots** before claiming a UX cycle passes; JSON confirms clicks only. Repeatable missions: `demo/agentScenarios.ts`; headless check: `npm run test:agent-guide`.

## Pull requests

- Prefer focused PRs that match a single plan unit.
- Describe the why; link the plan file when applicable.
- Do not commit secrets or generated `dist/` / `demo-dist/` artifacts unless the workflow requires them.
