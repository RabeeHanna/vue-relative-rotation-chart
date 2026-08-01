import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readCss(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('CSS theme tokens', () => {
  it('exposes --rrg-font-family on chart with the prior default stack', () => {
    const css = readCss('src/components/RrgChart.css')
    expect(css).toContain('--rrg-font-family: ui-sans-serif, system-ui, sans-serif')
    expect(css).toContain('font-family: var(--rrg-font-family)')
  })

  it('exposes --rrg-font-family and --rrg-ctl-radius on controls surface', () => {
    const css = readCss('src/components/rrgControlsShared.css')
    expect(css).toContain('--rrg-font-family:')
    expect(css).toContain('--rrg-ctl-radius: 8px')
    expect(css).toContain('font-family: var(--rrg-font-family)')
  })

  it('wires --rrg-ctl-radius into control chrome surfaces', () => {
    const files = [
      'src/components/RrgChartControlsPanel.css',
      'src/components/RrgViewportControls.css',
      'src/components/RrgDisplaySettingsControls.css',
      'src/components/RrgSeriesVisibilityControls.css',
    ]
    for (const file of files) {
      const css = readCss(file)
      expect(css, file).toContain('var(--rrg-ctl-radius')
      expect(css, file).not.toMatch(/border-radius:\s*8px/)
    }
  })

  it('migrates playback onto --rrg-ctl-* tokens and --rrg-font-family', () => {
    const css = readCss('src/components/RrgPlaybackControls.css')
    expect(css).toContain('--rrg-font-family:')
    expect(css).toContain('font-family: var(--rrg-font-family)')
    expect(css).toContain('border: 1px solid var(--rrg-ctl-border)')
    expect(css).toContain('background: var(--rrg-ctl-panel-bg)')
    expect(css).toContain('color: var(--rrg-ctl-text)')
    expect(css).toContain('background: var(--rrg-ctl-surface)')
    expect(css).toContain('border: 1px solid var(--rrg-ctl-surface-border)')
    expect(css).toContain('border-radius: var(--rrg-ctl-radius, 0)')
    expect(css).toContain('border-radius: var(--rrg-ctl-radius, 999px)')
    expect(css).toContain('background: var(--rrg-ctl-track)')
    // Dark mode redefines tokens rather than hardcoding element colors.
    expect(css).toContain('.rrg-playback.dark')
    expect(css).toMatch(/\.rrg-playback\.dark[\s\S]*--rrg-ctl-text:\s*#f5f5f5/)
    expect(css).not.toMatch(/\.rrg-playback\.dark[\s\S]*\.rrg-playback__btn\s*\{[^}]*background:\s*#333/)
  })

  it('axis and quadrant labels consume --rrg-font-family', () => {
    const axes = readCss('src/components/RrgAxes.vue')
    const quadrants = readCss('src/components/RrgQuadrants.vue')
    expect(axes).toContain('font-family: var(--rrg-font-family')
    expect(quadrants).toContain('font-family: var(--rrg-font-family')
  })
})
