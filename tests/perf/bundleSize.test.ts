import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import {
  BUNDLE_ARTIFACTS,
  BUNDLE_BASELINES,
  BUNDLE_CEILINGS,
  distReady,
  formatBundleTable,
  readBundleSizes,
  softLimitBytes,
  SOFT_RATIO,
} from './bundleSize'

const root = process.cwd()
const distDir = join(root, 'dist')
/** Full `npm test` may run before `build` in CI — skip IO unless dist exists or this file is targeted. */
const requireDist =
  process.env.REQUIRE_DIST === '1' ||
  process.argv.some((arg) => /bundleSize\.test\.(ts|js)/.test(arg))
const ready = distReady(distDir)

describe('bundle size tracking (C20)', () => {
  it('baselines stay below hard ceilings and soft ratio is sane', () => {
    expect(SOFT_RATIO).toBeGreaterThan(1)
    for (const file of BUNDLE_ARTIFACTS) {
      expect(BUNDLE_BASELINES[file]).toBeGreaterThan(0)
      expect(BUNDLE_CEILINGS[file]).toBeGreaterThan(BUNDLE_BASELINES[file])
      expect(softLimitBytes(BUNDLE_BASELINES[file])).toBeLessThanOrEqual(BUNDLE_CEILINGS[file])
    }
  })

  it('softLimitBytes applies ratio', () => {
    expect(softLimitBytes(1000, 1.25)).toBe(1250)
    expect(softLimitBytes(1000, 1.1)).toBe(1100)
  })

  it.skipIf(!ready && !requireDist)(
    'dist artifacts exist under hard ceilings (soft-warn above baseline×1.25)',
    () => {
      if (!ready) {
        expect.fail(
          'dist/ missing published artifacts — run `npm run build` (CI sets REQUIRE_DIST=1 after build)',
        )
      }

      const rows = readBundleSizes(distDir)
      // Soft warn: growth past baseline×ratio — informational, not a fail.
      for (const row of rows) {
        if (row.overSoft) {
          console.warn(
            `[bundle-size soft warn] ${row.file}: ${row.bytes} B > soft ${row.softLimit} B ` +
              `(baseline ${row.baseline}). Update baselines in tests/perf/bundleSize.ts if intentional.`,
          )
        }
      }

      for (const row of rows) {
        expect(row.bytes, `${row.file} missing or empty`).toBeGreaterThan(0)
        expect(
          row.bytes,
          `${row.file} ${row.bytes} B exceeds hard ceiling ${row.ceiling} B\n${formatBundleTable(rows)}`,
        ).toBeLessThanOrEqual(row.ceiling)
      }

      console.log(`[bundle-size]\n${formatBundleTable(rows)}`)
    },
  )

  it('skips size IO when dist is absent and REQUIRE_DIST is unset', () => {
    if (ready || requireDist) return
    expect(distReady(distDir)).toBe(false)
  })
})
