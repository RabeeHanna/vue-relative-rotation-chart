# C1: Component Project Skeleton

**Phase:** Foundation  
**Estimate:** 1–2 days  
**Depends on:** PRE-C1-A, PRE-C1-B, PRE-C1-C complete  
**Priority:** Standard

---

## Goal

Create the standalone reusable component project as a separate git repository with a working development environment, demo playground, and test setup — before writing any chart logic.

---

## Why Separate Repo from Day One

Building inside Sector Orbit and extracting later almost always leaks app-specific context into the "generic" API:
- Internal state shapes creep into component props
- App-specific utilities get called from inside the component
- The generic boundary is never properly tested because everything is in the same codebase

A separate repo forces the adapter boundary to be real from the first line of code. During development, Sector Orbit consumes the component via a workspace link:

```json
// sector-orbit/package.json
{
  "dependencies": {
    "vue-relative-rotation-chart": "file:../vue-relative-rotation-chart"
  }
}
```

---

## Scope

### Project Setup
- Vue 3 + TypeScript + Vite
- `package.json` with correct package name (`vue-relative-rotation-chart`), version (`0.1.0`), and `main`/`exports` fields
- `tsconfig.json` with strict TypeScript settings
- `vite.config.ts` configured for library build mode (outputs `dist/`)
- `.gitignore` with `node_modules/`, `dist/`

### Build and Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "typecheck": "vue-tsc --noEmit",
    "lint": "eslint src --ext .ts,.vue"
  }
}
```

### Demo Playground
- A `demo/` directory (or `src/demo/`) with a Vite app that renders the `RrgChart` placeholder
- `demo/mockSeries.ts` — basic mock data for development (will be expanded in later units)
- Demo page renders in browser at `http://localhost:5173`

### Test Setup
- Vitest configured (`vitest.config.ts` or inline in `vite.config.ts`)
- `@vue/test-utils` installed
- A smoke test file that imports `RrgChart` and asserts it mounts without errors

### Lint Setup
- ESLint with `@typescript-eslint` and `eslint-plugin-vue`
- Rules: no-any preferred, consistent Vue SFC style

### Source Structure
Create the following empty placeholder files (to be implemented in later units):

```
src/
  components/
    RrgChart.vue            ← public wrapper (placeholder: renders <div>RRG Chart</div>)
    RrgSvgRoot.vue
    RrgAxes.vue
    RrgQuadrants.vue
    RrgTails.vue
    RrgPoints.vue
    RrgLabels.vue
    RrgTooltip.vue
  composables/
    useRrgScales.ts
    useRrgViewport.ts
    useRrgTailSlices.ts
    useRrgLabelLayout.ts
    useRrgHoverState.ts
  types/
    rrg.ts                  ← placeholder, implemented in C2
  utils/
    path.ts
    bounds.ts
    ticks.ts
    labels.ts
  index.ts                  ← package entry point, exports RrgChart and types
```

### Package Entry Point (`src/index.ts`)
```ts
export { default as RrgChart } from './components/RrgChart.vue'
export type * from './types/rrg'
```

### README
A minimal `README.md` stating:
- Package name and description
- "This component is a renderer — it does not fetch data or perform calculations"
- "All RRG data (RS-Ratio, RS-Momentum) must be pre-calculated and passed as series props"
- Install instructions (file: link for now)
- Basic usage example (placeholder, updated in C2)

---

## Acceptance Criteria

- [ ] Project runs independently — `npm install` and `npm run dev` succeed
- [ ] Demo page loads in browser at localhost:5173
- [ ] Placeholder `RrgChart` component renders without errors
- [ ] Package entry point (`src/index.ts`) exports `RrgChart`
- [ ] `npm run build` completes and outputs `dist/`
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm test` runs and the smoke test passes
- [ ] README states that calculations are provided by the caller
- [ ] `.gitignore` present and correct
- [ ] Git repo initialized (separate from Sector Orbit)

---

## Dependencies to Install

```json
{
  "dependencies": {
    "vue": "^3.x",
    "d3-scale": "^4.x",
    "d3-axis": "^3.x",
    "d3-shape": "^3.x",
    "d3-array": "^3.x"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^x.x",
    "@vue/test-utils": "^2.x",
    "@typescript-eslint/eslint-plugin": "^x.x",
    "@typescript-eslint/parser": "^x.x",
    "eslint": "^x.x",
    "eslint-plugin-vue": "^x.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "vitest": "^x.x",
    "vue-tsc": "^x.x"
  }
}
```

Note: Only install D3 subpackages needed — do not install the full `d3` meta-package.

---

## Notes

- Do not add Pinia, Vue Router, or any other Vue ecosystem packages. The component is self-contained.
- Do not add Tailwind, UnoCSS, or any CSS framework. Styling is via CSS variables only.
- The Vite library build configuration (`lib` mode) should output both ESM and CommonJS formats.
- Keep `vite.config.ts` simple. Complex bundler configuration is premature at this stage.
