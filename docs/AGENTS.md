# docs

## Purpose

Maintainer-facing guides that are not the package README marketing surface.

## Belongs here

- Performance playbook (`perf.md`), dated results (`perf-results.md`), and similar how-to docs for contributors
- **npm publish playbook** (`publish.md`) — manual login + publish steps
- Agent visual QA (`agent-visual-qa.md`, `agent-visual-qa-rubric.md`) — C24 browse/click loop (**repo-local; not on npm**)
- Short operational guides linked from `CONTRIBUTING.md`

## Does not belong here

- Unit-of-work specs (`plans/`)
- Public API reference that belongs in `README.md`
- Demo app code (`demo/`)
- Published npm artifacts (`dist/`)

## Depends on

- C17 / C20 harness and plan decisions for accurate commands
- C26 pack-consumer tests for publish checklist

## Used by

- Contributors following `CONTRIBUTING.md`
- Agents implementing or debugging performance / release work
