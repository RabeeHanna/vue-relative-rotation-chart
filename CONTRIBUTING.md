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

## Layout

See root [`AGENTS.md`](./AGENTS.md) and directory `AGENTS.md` files for placement rules. Cursor rules live in `.cursor/rules/`.

## Pull requests

- Prefer focused PRs that match a single plan unit.
- Describe the why; link the plan file when applicable.
- Do not commit secrets or generated `dist/` / `demo-dist/` artifacts unless the workflow requires them.
