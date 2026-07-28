# e2e

## Purpose

Playwright smoke tests against the Vite demo for agent/Playwright inspectability.

## Belongs here

- `*.spec.ts` browser smoke tests using `data-testid` hooks
- Chart interaction checks that complement Vitest unit tests

## Does not belong here

- Unit / component tests (`tests/*.test.ts`)
- Production chart source

## Depends on

- Demo app (`npm run dev`)
- Playwright config at repo root

## Used by

- `npm run test:e2e`
- `npm run review:artifacts` (adversarial screenshots + JSON via `playwright.review.config.ts`)
- C9 accessibility / agent-testability acceptance
- C18 pre-npm review artifacts
- [C24 agent visual QA](../plans/C24-agent-visual-qa.md) — interactive missions + optional `agent-guide.spec.ts`
