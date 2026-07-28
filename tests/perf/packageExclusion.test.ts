import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { NPM_EXCLUDED_PATH_FRAGMENTS } from './publishBoundary'

const root = process.cwd()
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
/** npm pack under parallel Vitest load on Windows can exceed the 5s default. */
const PACK_TIMEOUT_MS = 30_000

describe('perf harness package exclusion', () => {
  it('package.json files allowlist is dist-only (no tests/ or demo/)', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      files?: string[]
    }
    expect(pkg.files).toEqual(['dist'])
    for (const entry of pkg.files ?? []) {
      expect(entry).not.toMatch(/^tests(\/|$)/)
      expect(entry).not.toMatch(/^demo(\/|$)/)
    }
  })

  it(
    'npm pack dry-run does not include tests, demo, or agent QA tooling',
    () => {
      const result = spawnSync(npmBin, ['pack', '--dry-run'], {
        cwd: root,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })

      if (result.error) {
        throw result.error
      }
      expect(result.status, `npm pack stderr:\n${result.stderr ?? ''}`).toBe(0)

      const blob = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.toLowerCase()
      for (const fragment of NPM_EXCLUDED_PATH_FRAGMENTS) {
        expect(blob).not.toContain(fragment)
      }
      expect(blob.length).toBeGreaterThan(0)
    },
    PACK_TIMEOUT_MS,
  )
})
