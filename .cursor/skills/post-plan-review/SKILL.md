---
name: post-plan-review
description: >-
  Staff-level code review of a completed unit's branch changes. Reviews for
  cleanliness, duplication, and test coverage without making any code edits.
  Use at the end of a unit implementation, when the user says "review the plan",
  "post-plan review", "review what we just built", or "run a post-plan review".
disable-model-invocation: true
---

# Post-Plan Review

Read-only staff-level review of recent unit commits. Identify improvements; do not make edits.

## When to apply

- User has just finished implementing a unit
- User says "review the plan", "post-plan review", "review what we just built"

## Workflow

### 1. Collect the diff and context

```bash
git log --oneline master..HEAD
git diff master...HEAD --stat
git diff master...HEAD
```

If reviewing only the latest unit commit:

```bash
git show --stat HEAD
git show HEAD
```

Read any **untracked** new files from `git status` with the Read tool.

Identify callers of changed modules and read those files too.

### 2. Review criteria

1. **Cleanliness** — naming, dead code, over-abstraction, magic values, AGENTS.md boundary violations
2. **Duplication** — logic repeated across files that could share a helper
3. **Test coverage** — missing edge cases, untested branches, weak assertions
4. **Renderer-only** — no fetch/calc leakage; D3 used for math only

### 3. Output format

Group findings by file. For each finding:

- Severity: P1 (important) | P2 (nice to have)
- Category: cleanliness | duplication | test-coverage | boundary
- File + approximate line range
- One-sentence description
- Concrete suggestion (≤ 10 lines if code)

End with **Summary**: P1 / P2 counts and the single highest-value change.

## Do not

- Edit any source files
- Commit anything
- Create new test files (suggest them instead)
- Review unrelated files outside the diff
