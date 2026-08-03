import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

describe('declared dependencies', () => {
  it('omits unused d3-axis and d3-shape packages', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    expect(pkg.dependencies).not.toHaveProperty('d3-axis')
    expect(pkg.dependencies).not.toHaveProperty('d3-shape')
    expect(pkg.devDependencies).not.toHaveProperty('@types/d3-axis')
    expect(pkg.devDependencies).not.toHaveProperty('@types/d3-shape')
    expect(pkg.dependencies).toMatchObject({
      'd3-array': expect.any(String),
      'd3-scale': expect.any(String),
    })
  })

  it('removes dead path placeholder utility', () => {
    expect(existsSync(join(root, 'src/utils/path.ts'))).toBe(false)
  })
})
