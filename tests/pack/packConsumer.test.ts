import { describe, expect, it } from 'vitest'
import { copyFileSync, existsSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const root = process.cwd()
const distDir = join(root, 'dist')
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const PACK_TIMEOUT_MS = 60_000

const REQUIRED_DIST_FILES = [
  'index.d.ts',
  'vue-relative-rotation-chart.js',
  'vue-relative-rotation-chart.cjs',
  'vue-relative-rotation-chart.css',
  'scenarios.js',
  'scenarios/index.d.ts',
]

function packDryRunListing(): string {
  const result = spawnSync(npmBin, ['pack', '--dry-run'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    timeout: PACK_TIMEOUT_MS,
  })
  expect(result.status, result.stderr).toBe(0)
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`
}

describe('npm pack tarball contents', () => {
  it.skipIf(!existsSync(distDir))('packed tarball lists required dist artifacts', () => {
    const listing = packDryRunListing().toLowerCase()
    for (const file of REQUIRED_DIST_FILES) {
      expect(listing).toContain(`dist/${file}`)
    }
    expect(listing).toContain('readme.md')
    expect(listing).toContain('license')
  })
})

describe('tarball consumer smoke', () => {
  it.skipIf(!existsSync(distDir))(
    'clean consumer installs .tgz and production build succeeds',
    () => {
      const pack = spawnSync(npmBin, ['pack', '--pack-destination', root], {
        cwd: root,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(pack.status, pack.stderr).toBe(0)
      const match = (pack.stdout ?? '').match(/vue-relative-rotation-chart-[\d.]+\.tgz/)
      expect(match).toBeTruthy()

      const fixtureRoot = join(root, 'tests/pack/consumer-fixture')
      copyFileSync(join(root, match![0]!), join(fixtureRoot, 'package.tgz'))

      rmSync(join(fixtureRoot, 'node_modules'), { recursive: true, force: true })
      rmSync(join(fixtureRoot, 'package-lock.json'), { force: true })
      rmSync(join(fixtureRoot, 'dist-consumer'), { recursive: true, force: true })

      const install = spawnSync(npmBin, ['install'], {
        cwd: fixtureRoot,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(install.status, install.stderr).toBe(0)

      const typecheck = spawnSync(npmBin, ['run', 'typecheck'], {
        cwd: fixtureRoot,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(typecheck.status, typecheck.stderr).toBe(0)

      const build = spawnSync(npmBin, ['run', 'build'], {
        cwd: fixtureRoot,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(build.status, build.stderr).toBe(0)
      expect(existsSync(join(fixtureRoot, 'dist-consumer'))).toBe(true)
    },
    PACK_TIMEOUT_MS * 4,
  )

  it.skipIf(!existsSync(distDir))(
    'clean CJS consumer requires the package and loads named exports',
    () => {
      const pack = spawnSync(npmBin, ['pack', '--pack-destination', root], {
        cwd: root,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(pack.status, pack.stderr).toBe(0)
      const match = (pack.stdout ?? '').match(/vue-relative-rotation-chart-[\d.]+\.tgz/)
      expect(match).toBeTruthy()

      const fixtureRoot = join(root, 'tests/pack/cjs-consumer-fixture')
      copyFileSync(join(root, match![0]!), join(fixtureRoot, 'package.tgz'))

      rmSync(join(fixtureRoot, 'node_modules'), { recursive: true, force: true })
      rmSync(join(fixtureRoot, 'package-lock.json'), { force: true })

      const install = spawnSync(npmBin, ['install'], {
        cwd: fixtureRoot,
        encoding: 'utf8',
        shell: process.platform === 'win32',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(install.status, install.stderr).toBe(0)

      const smoke = spawnSync(process.execPath, ['smoke.cjs'], {
        cwd: fixtureRoot,
        encoding: 'utf8',
        timeout: PACK_TIMEOUT_MS,
      })
      expect(smoke.status, `${smoke.stderr}\n${smoke.stdout}`).toBe(0)
      expect(smoke.stdout).toContain('cjs smoke ok')
    },
    PACK_TIMEOUT_MS * 3,
  )
})
