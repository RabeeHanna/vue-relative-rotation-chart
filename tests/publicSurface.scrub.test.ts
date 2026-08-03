/**
 * Public-surface scrub — fails CI if forbidden strings reappear under hard-gate trees.
 *
 * Forbidden brand patterns (allowlisted only in this comment):
 *   Sector Orbit | sector orbit | SectorOrbit | sector-orbit | sector_orbit
 *
 * Forbidden process-language patterns (unit chronology in shipped comments):
 *   PRE-C## | standalone C## references in comments
 */
import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const FORBIDDEN_BRAND =
  /Sector Orbit|sector orbit|SectorOrbit|sector-orbit|sector_orbit/i

/** Unit-number chronology in comments (not ticker symbols like C17 in scenario data). */
const FORBIDDEN_PROCESS = /\bPRE-C\d|\bC\d{1,2}\b(?=[^\w]|$)/

const HARD_GATE_DIRS = ['src', 'demo', 'tests']
const HARD_GATE_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'LICENSE',
  'package.json',
  'AGENTS.md',
  'index.html',
]

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'demo-dist',
  '.git',
  'coverage',
])

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
    else if (/\.(ts|tsx|vue|js|mjs|cjs|css|md|json|html|txt|d\.ts)$/i.test(name)) {
      out.push(full)
    }
  }
}

function relativePosix(file: string): string {
  return path.relative(root, file).split(path.sep).join('/')
}

function collectHardGateFiles(): string[] {
  const files: string[] = []
  for (const dir of HARD_GATE_DIRS) {
    walkFiles(path.join(root, dir), files)
  }
  for (const name of HARD_GATE_FILES) {
    const full = path.join(root, name)
    if (existsSync(full) && statSync(full).isFile()) files.push(full)
  }
  return files
}

function lineHits(file: string, pattern: RegExp): string[] {
  const rel = relativePosix(file)
  if (ALLOWLIST_FILES.has(path.normalize(rel))) return []
  const text = readFileSync(file, 'utf8')
  if (!pattern.test(text)) return []
  const hits: string[] = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, i) => {
    if (pattern.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim()}`)
  })
  return hits
}

describe('public surface scrub', () => {
  it('has no forbidden brand strings under hard-gate paths', () => {
    const hits = collectHardGateFiles().flatMap((file) => lineHits(file, FORBIDDEN_BRAND))
    expect(hits, hits.join('\n')).toEqual([])
  })

  it('has no unit-number process language in src comments', () => {
    const srcFiles: string[] = []
    walkFiles(path.join(root, 'src'), srcFiles)
    const hits = srcFiles.flatMap((file) => lineHits(file, FORBIDDEN_PROCESS))
    expect(hits, hits.join('\n')).toEqual([])
  })

  it('has no unit-number process language in built declarations', () => {
    const distDir = path.join(root, 'dist')
    if (!existsSync(distDir)) return

    const dtsFiles: string[] = []
    walkFiles(distDir, dtsFiles)
    const declarationFiles = dtsFiles.filter((f) => f.endsWith('.d.ts'))
    const hits = declarationFiles.flatMap((file) => lineHits(file, FORBIDDEN_PROCESS))
    expect(hits, hits.join('\n')).toEqual([])
  })
})
