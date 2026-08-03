import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const distDir = join(root, 'dist')

function walkDts(dir: string, out: string[]): void {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkDts(full, out)
    else if (entry.name.endsWith('.d.ts')) out.push(full)
  }
}

function collectDtsFiles(dir: string): string[] {
  const out: string[] = []
  walkDts(dir, out)
  return out
}

describe('rolled-up public declarations', () => {
  it.skipIf(!existsSync(join(distDir, 'index.d.ts')))(
    'omits internal component declaration files from dist',
    () => {
      const dtsFiles = collectDtsFiles(distDir)
      const internalComponentDts = dtsFiles.filter((file) =>
        /[\\/]components[\\/]RrgSvgRoot\.vue\.d\.ts$/i.test(file),
      )
      expect(internalComponentDts).toEqual([])

      const index = readFileSync(join(distDir, 'index.d.ts'), 'utf8')
      expect(index).toContain('RrgChart')
      expect(index).toContain('RrgRenderSeries')
      expect(index).not.toMatch(/\bRrgSvgRoot\b/)
      expect(index).not.toMatch(/\buseRrgViewport\b/)
    },
  )

  it.skipIf(!existsSync(join(distDir, 'scenarios', 'index.d.ts')))(
    'keeps scenarios subpath declarations separate from the root rollup',
    () => {
      const scenarios = readFileSync(join(distDir, 'scenarios', 'index.d.ts'), 'utf8')
      expect(scenarios).toContain('scenarioFixtures')
    },
  )
})
