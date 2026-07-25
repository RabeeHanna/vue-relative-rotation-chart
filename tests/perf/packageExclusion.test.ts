import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const root = process.cwd()
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'

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

  it('npm pack dry-run does not include tests/perf or demo sources', () => {
    const result = spawnSync(npmBin, ['pack', '--dry-run'], {
      cwd: root,
      encoding: 'utf8',
      shell: process.platform === 'win32',
    })
    expect(result.status).toBe(0)
    const blob = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.toLowerCase()
    expect(blob).not.toMatch(/tests\/perf/)
    expect(blob).not.toMatch(/demo\/demoperf/)
    expect(blob).not.toMatch(/demo\/demoapp/)
    // Pack notice lists included paths on stderr for modern npm.
    expect(blob.length).toBeGreaterThan(0)
  })
})
