import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')

function readRoot(rel: string): string {
  return readFileSync(resolve(root, rel), 'utf8')
}

function extractJsonLd(html: string): Record<string, unknown> {
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)
  expect(match).toBeTruthy()
  return JSON.parse(match![1]!) as Record<string, unknown>
}

describe('discoverability demo shell', () => {
  it('index.html includes crawlable metadata and static hero', () => {
    const html = readRoot('index.html')
    expect(html).toMatch(/Vue 3 RRG Chart Component Demo/)
    expect(html).toMatch(/name="description"/)
    expect(html).toMatch(
      /rel="canonical" href="https:\/\/rabeehanna\.github\.io\/vue-relative-rotation-chart\/"/,
    )
    expect(html).toMatch(/property="og:title"/)
    expect(html).toMatch(/property="og:image"/)
    expect(html).toMatch(/<h1>Interactive Vue 3 Relative Rotation Graph component<\/h1>/)
    expect(html).toMatch(/<noscript>/)
    expect(html).toMatch(/id="app"/)
    expect(html).toMatch(/sector-orbit-web\.onrender\.com/)
  })

  it('JSON-LD is valid and has no invented review data', () => {
    const html = readRoot('index.html')
    const ld = extractJsonLd(html)
    expect(ld['@type']).toBe('SoftwareApplication')
    expect(ld).not.toHaveProperty('aggregateRating')
    expect(ld).not.toHaveProperty('review')
    expect(JSON.stringify(ld)).not.toMatch(/aggregateRating|reviewCount/i)
  })

  it('llms.txt states renderer boundary and install', () => {
    const txt = readRoot('public/llms.txt')
    expect(txt).toMatch(/Renderer only/i)
    expect(txt).toMatch(/npm install vue-relative-rotation-chart/)
    expect(txt).toMatch(/Does not fetch market prices/)
    expect(txt).toMatch(/rabeehanna\.github\.io/)
  })

  it('og-demo.png exists in public', () => {
    const buf = readFileSync(resolve(root, 'public/og-demo.png'))
    expect(buf.length).toBeGreaterThan(100)
    expect(buf[0]).toBe(0x89)
    expect(buf[1]).toBe(0x50)
  })
})
