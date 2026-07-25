/**
 * Public-surface scrub — fails CI if forbidden private-consumer brand strings
 * reappear under hard-gate trees.
 *
 * Forbidden patterns (allowlisted only in this comment):
 *   Sector Orbit | sector orbit | SectorOrbit | sector-orbit | sector_orbit
 */
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const FORBIDDEN =
  /Sector Orbit|sector orbit|SectorOrbit|sector-orbit|sector_orbit/i

const HARD_GATE_DIRS = ['src', 'demo', 'tests']
const HARD_GATE_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'LICENSE',
  'package.json',
  'AGENTS.md',
]

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'demo-dist',
  '.git',
  'coverage',
])

/** This scrub test file may mention forbidden patterns in the allowlist comment above. */
const ALLOWLIST_FILES = new Set([
  path.normalize('tests/publicSurface.scrub.test.ts'),
])

function walkFiles(dir: string, out: string[]): void {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const name of entries) {
    if (SKIP_DIR_NAMES.has(name)) continue
    const full = path.join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walkFiles(full, out)
    else if (/\.(ts|tsx|vue|js|mjs|cjs|css|md|json|html|txt)$/i.test(name)) {
      out.push(full)
    }
  }
}

function relativePosix(file: string): string {
  return path.relative(root, file).split(path.sep).join('/')
}

describe('public surface scrub', () => {
  it('has no forbidden brand strings under hard-gate paths', () => {
    const files: string[] = []
    for (const dir of HARD_GATE_DIRS) {
      walkFiles(path.join(root, dir), files)
    }
    for (const name of HARD_GATE_FILES) {
      const full = path.join(root, name)
      try {
        if (statSync(full).isFile()) files.push(full)
      } catch {
        // optional file
      }
    }

    const hits: string[] = []
    for (const file of files) {
      const rel = relativePosix(file)
      if (ALLOWLIST_FILES.has(path.normalize(rel))) continue
      const text = readFileSync(file, 'utf8')
      if (FORBIDDEN.test(text)) {
        const lines = text.split(/\r?\n/)
        lines.forEach((line, i) => {
          if (FORBIDDEN.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim()}`)
        })
      }
    }

    expect(hits, hits.join('\n')).toEqual([])
  })
})
