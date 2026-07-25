# utils

## Purpose

Pure, framework-agnostic helpers.

## Belongs here

- Bounds/padding, tick helpers, path builders, label width estimates
- Functions with no Vue reactivity and no DOM access

## Does not belong here

- Composables (`ref` / `computed` / lifecycle)
- Vue components
- Network or storage

## Depends on

- Optional D3 math imports

## Used by

- Composables and components
- Unit tests in `tests/`
