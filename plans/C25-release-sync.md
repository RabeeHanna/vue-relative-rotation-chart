# C25 — GitHub release sync (0.1.3)

## Status

**Complete** (branch model documented; tag/release steps below for maintainer)

## Goal

Align GitHub `master`, tags, and npm at version 0.1.3.

## Branch model

Documented in [`CONTRIBUTING.md`](./CONTRIBUTING.md): `develop` = default/unreleased; `master` = last npm release.

## Maintainer release sync (0.1.3)

```bash
git checkout master
git merge --ff-only develop   # or: git reset --hard 1b0faef
git tag -a v0.1.3 -m "Release 0.1.3"
git push origin master
git push origin v0.1.3
```

Create GitHub Release from tag `v0.1.3` with changelog notes from [`CHANGELOG.md`](./CHANGELOG.md).

## Acceptance criteria

- [x] CONTRIBUTING documents develop/master/tag workflow
- [ ] `master` at 0.1.3 source (push after merge)
- [ ] `v0.1.3` tag and GitHub Release exist
