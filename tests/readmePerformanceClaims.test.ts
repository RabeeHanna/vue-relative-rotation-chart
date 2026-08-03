import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')

describe('README performance claims', () => {
  it('does not present unqualified consumer FPS guarantees', () => {
    expect(readme).not.toMatch(/targets \*\*55\+ fps\*\*/i)
    expect(readme).not.toMatch(/sustains \*\*55\+ fps\*\*/i)
    expect(readme.toLowerCase()).toContain('engineering baseline')
    expect(readme).toContain('tests/perf/')
  })

  it('documents the default perf fixture profiles', () => {
    expect(readme).toContain('default')
    expect(readme).toContain('longPlayback200')
    expect(readme).toContain('Chromium')
  })
})
