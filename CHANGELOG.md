# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Public release hygiene (C14): MIT license, contributing/security docs, CI gates
- Optional `vue-relative-rotation-chart/scenarios` export subpath with named fixtures
- Demo static build (`npm run build:demo`) for GitHub Pages

### Changed

- Vue is peer-only (removed from `dependencies`; still required by consumers)

### Notes

- First **npm publish** is deferred until a deliberate public release; use git/`file:` installs until then

## [0.1.0] - 2026-07-25

### Added

- Initial public-facing package surface: `RrgChart`, playback controls, typed render contract
- Vite demo playground with scenarios, copy-as-code, and session persistence
