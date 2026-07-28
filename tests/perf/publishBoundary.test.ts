import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DIST_AGENT_QA_FORBIDDEN } from './publishBoundary'

const root = process.cwd()
const distDir = join(root, 'dist')

function listDistJsFiles(): string[] {
  if (!existsSync(distDir)) return []
  const entries = readdirSync(distDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && /\.(js|cjs|mjs)$/.test(entry.name))
    .map((entry) => join(distDir, entry.name))
}

describe('published dist excludes C24 agent QA demo tooling', () => {
  it.skipIf(!listDistJsFiles().length)(
    'dist JS bundles do not embed agent-state panel or demo QA helpers',
    () => {
      const files = listDistJsFiles()
      expect(files.length).toBeGreaterThan(0)

      for (const file of files) {
        const text = readFileSync(file, 'utf8').toLowerCase()
        for (const forbidden of DIST_AGENT_QA_FORBIDDEN) {
          expect(text, `${file} must not contain ${forbidden}`).not.toContain(
            forbidden.toLowerCase(),
          )
        }
      }
    },
  )
})
