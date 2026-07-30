import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

/** Published artifacts that belong in the npm tarball (`files: ["dist"]`). */
export const BUNDLE_ARTIFACTS = [
  'vue-relative-rotation-chart.js',
  'vue-relative-rotation-chart.umd.cjs',
  'vue-relative-rotation-chart.css',
  'scenarios.js',
] as const

export type BundleArtifact = (typeof BUNDLE_ARTIFACTS)[number]

/**
 * Baselines from a local `npm run build` on 2026-07-30 (Windows) after C22/C23 controls panel.
 * Soft-warn when a file exceeds `baseline * SOFT_RATIO` — not a hard fail.
 */
export const BUNDLE_BASELINES: Record<BundleArtifact, number> = {
  'vue-relative-rotation-chart.js': 62_478,
  'vue-relative-rotation-chart.umd.cjs': 49_627,
  'vue-relative-rotation-chart.css': 14_690,
  'scenarios.js': 15_916,
}

/** Soft growth signal (~25% over baseline). Warn only. */
export const SOFT_RATIO = 1.25

/**
 * Hard ceilings — generous so PR CI does not flake on minor churn;
 * fails on accidental doubling / wrong asset in dist.
 */
export const BUNDLE_CEILINGS: Record<BundleArtifact, number> = {
  'vue-relative-rotation-chart.js': 120_000,
  'vue-relative-rotation-chart.umd.cjs': 100_000,
  'vue-relative-rotation-chart.css': 22_000,
  'scenarios.js': 50_000,
}

export type BundleSizeRow = {
  file: BundleArtifact
  bytes: number
  baseline: number
  ceiling: number
  softLimit: number
  overSoft: boolean
  overCeiling: boolean
}

export function softLimitBytes(baseline: number, ratio = SOFT_RATIO): number {
  return Math.ceil(baseline * ratio)
}

export function readBundleSizes(distDir: string): BundleSizeRow[] {
  return BUNDLE_ARTIFACTS.map((file) => {
    const bytes = statSync(join(distDir, file)).size
    const baseline = BUNDLE_BASELINES[file]
    const ceiling = BUNDLE_CEILINGS[file]
    const softLimit = softLimitBytes(baseline)
    return {
      file,
      bytes,
      baseline,
      ceiling,
      softLimit,
      overSoft: bytes > softLimit,
      overCeiling: bytes > ceiling,
    }
  })
}

export function distReady(distDir: string): boolean {
  return BUNDLE_ARTIFACTS.every((file) => existsSync(join(distDir, file)))
}

export function formatBundleTable(rows: BundleSizeRow[]): string {
  const lines = rows.map(
    (r) =>
      `${r.file}: ${r.bytes} B (baseline ${r.baseline}, soft ${r.softLimit}, ceiling ${r.ceiling})` +
      (r.overSoft ? ' [SOFT WARN]' : '') +
      (r.overCeiling ? ' [OVER CEILING]' : ''),
  )
  return lines.join('\n')
}
