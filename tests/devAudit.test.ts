import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const root = process.cwd()
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'

describe('dev dependency audit hygiene', () => {
  it('pins happy-dom past known advisories', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      devDependencies?: Record<string, string>
    }
    const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')) as {
      packages?: Record<string, { version?: string }>
    }

    expect(pkg.devDependencies?.['happy-dom']).toMatch(/^[\^~]?20\./)
    const resolved = lock.packages?.['node_modules/happy-dom']?.version ?? '0.0.0'
    const [major, minor, patch] = resolved.split('.').map(Number)
    expect(major).toBeGreaterThanOrEqual(20)
    expect(minor > 8 || (minor === 8 && patch >= 9)).toBe(true)
  })

  it('has Dependabot coverage for npm and GitHub Actions', () => {
    const config = readFileSync(join(root, '.github/dependabot.yml'), 'utf8')
    expect(config).toContain('package-ecosystem: npm')
    expect(config).toContain('package-ecosystem: github-actions')
  })

  it('reports no critical or high npm audit findings', () => {
    const result = spawnSync(npmBin, ['audit', '--json'], {
      cwd: root,
      encoding: 'utf8',
      shell: process.platform === 'win32',
      timeout: 60_000,
    })

    expect(result.status, result.stderr).toBe(0)
    const report = JSON.parse(result.stdout ?? '{}') as {
      metadata?: { vulnerabilities?: Record<string, number> }
    }
    const counts = report.metadata?.vulnerabilities ?? {}
    expect(counts.critical ?? 0).toBe(0)
    expect(counts.high ?? 0).toBe(0)
  })
})
