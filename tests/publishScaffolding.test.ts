import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const DOC_PATHS = [
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'docs/AGENTS.md',
  '.gitignore',
]

describe('publish scaffolding cleanup', () => {
  it('removes obsolete publish doc and env template files', () => {
    expect(existsSync(path.join(root, 'docs/publish.md'))).toBe(false)
    expect(existsSync(path.join(root, '.env.example'))).toBe(false)
    expect(existsSync(path.join(root, '.env'))).toBe(false)
  })

  it('has no NPM_TOKEN or docs/publish.md references in contributor docs', () => {
    for (const rel of DOC_PATHS) {
      const text = readFileSync(path.join(root, rel), 'utf8')
      expect(text, rel).not.toMatch(/NPM_TOKEN/)
      expect(text, rel).not.toMatch(/docs\/publish\.md/)
    }
  })

  it('documents manual publish steps in CONTRIBUTING.md', () => {
    const contributing = readFileSync(path.join(root, 'CONTRIBUTING.md'), 'utf8')
    expect(contributing).toContain('npm login')
    expect(contributing).toContain('npm publish --access public')
    expect(contributing).toContain('tests/pack/packConsumer.test.ts')
  })

  it('ignores adversarial review markdown copies', () => {
    const gitignore = readFileSync(path.join(root, '.gitignore'), 'utf8')
    expect(gitignore).toMatch(/adversarial-review/)
    expect(gitignore).not.toMatch(/!\.env\.example/)
  })
})
