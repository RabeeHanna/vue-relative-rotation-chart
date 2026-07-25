---
name: pre-implementation-check
description: >-
  Pre-implementation readiness check before writing code: verify git state,
  plan dependencies, prerequisite files, tests, and branch setup. Use when the
  user asks to implement a plan, start a plan, begin implementation, check
  readiness, confirm the stage is set, verify everything is in order, or says
  "don't start yet" / "check before we begin". Apply automatically before
  starting any work from plans/*.md unless the user explicitly skips the check.
---

# Pre-Implementation Check

Run this **before writing implementation code**. Read-only investigation only — do not create files, edit source, or commit unless the user explicitly asks to fix blockers found during the check.

## When to apply

- User references a plan file (`plans/C*.md`, `plans/PRE-C1-*.md`) and wants to implement it
- User asks whether the repo is ready to start
- You are about to begin a multi-file feature from a unit plan

**Skip** when the user only wants a quick one-line fix, a question answered, or explicitly says to skip the check.

## Workflow

### 1. Identify the target plan

- Read the plan file the user named, or the next incomplete unit in `plans/00-overview.md` implementation order
- Note: **Unit ID**, **Depends on**, acceptance criteria, recorded decisions

### 2. Git and branch hygiene

```bash
git status --short
git branch --show-current
git log --oneline -5
```

| Check | Pass criteria |
|-------|---------------|
| Working tree | Clean, or user knows about uncommitted changes |
| Branch | On `develop` for unit work (not ad-hoc feature branches unless requested) |
| Prior units | Dependencies completed and present on `develop` |

### 3. Dependency verification

For each item in the plan’s **Depends on** chain:

1. Confirm prior unit decision/docs or code exists
2. Grep `src/` for files the current plan expects
3. Confirm package deps if the plan adds libraries

### 4. Health check

```bash
npm test
```

- All tests must pass before implementation starts
- If tests fail, report failures and **stop**

### 5. Scope delta

From the plan’s **Scope** / acceptance sections, list:

- **Already present**
- **To be created**
- **To be extended**

### 6. Blockers and go/no-go

| Verdict | Action |
|---------|--------|
| **Go** | Summarize readiness; proceed if user already said to implement |
| **Blocked** | List blockers; do not write feature code |
| **Plan drift** | Note mismatches; ask whether to update the plan first |

## Project conventions

- Plans live in `plans/`; order in `plans/00-overview.md`
- One commit per unit on `develop`
- Respect `AGENTS.md` boundaries and `.cursor/rules/`
- Unit tests required for production code

## Do not

- Start implementing during the check
- Commit plan doc updates unless the user asks
