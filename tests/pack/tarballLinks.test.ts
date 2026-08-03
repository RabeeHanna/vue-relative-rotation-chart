import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const README_RELATIVE_OK = new Set(['./LICENSE', './CHANGELOG.md', 'LICENSE', 'CHANGELOG.md'])

function extractMarkdownLinks(markdown: string): string[] {
  const links: string[] = []
  const regex = /\[[^\]]+\]\(([^)]+)\)/g
  for (const match of markdown.matchAll(regex)) {
    links.push(match[1]!)
  }
  return links
}

describe('npm-facing README links', () => {
  it('uses absolute GitHub URLs for repo-only docs', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8')
    const offenders: string[] = []

    for (const href of extractMarkdownLinks(readme)) {
      if (href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://')) {
        continue
      }
      if (README_RELATIVE_OK.has(href)) continue
      offenders.push(href)
    }

    expect(offenders, offenders.join('\n')).toEqual([])
  })

  it('does not reference removed docs/ paths', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8')
    expect(readme).not.toMatch(/docs\//)
  })
})

describe('publish lifecycle vs published files', () => {
  it('validates dist on prepublishOnly, not prepack', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>
      files?: string[]
    }

    expect(pkg.scripts?.prepack).toBeUndefined()
    expect(pkg.scripts?.prepublishOnly).toContain('prepack-check.mjs')
    expect(pkg.files).toEqual(['dist'])
    expect(pkg.files).not.toContain('scripts')
  })

  it('prepublish check script exists in maintainer repo', () => {
    const script = readFileSync(join(root, 'scripts/prepack-check.mjs'), 'utf8')
    expect(script).toContain('dist/')
  })
})
