import { describe, expect, it } from 'vitest'
import '../src/components/RrgChart.css'
import {
  collectRrgThemeVariables,
  RRG_CHART_EXPORT_CSS,
  resolveCssVarInValue,
} from '../src/utils/exportChartStyles'

describe('exportChartStyles', () => {
  it('resolves css var() with fallback', () => {
    const resolved = resolveCssVarInValue('var(--rrg-bg, #ffffff)', {})
    expect(resolved).toBe('#ffffff')
  })

  it('resolves css var() from theme map', () => {
    const resolved = resolveCssVarInValue('var(--rrg-bg)', { '--rrg-bg': '#242424' })
    expect(resolved).toBe('#242424')
  })

  it('collects computed theme variables from a chart host', () => {
    const host = document.createElement('div')
    host.className = 'rrg-chart dark'
    document.body.appendChild(host)

    const vars = collectRrgThemeVariables(host)
    expect(vars['--rrg-bg']).toBe('#242424')
    expect(vars['--rrg-label']).toBe('#f5f5f5')

    document.body.removeChild(host)
  })

  it('prefers computed custom properties when the runtime exposes them', () => {
    const host = document.createElement('div')
    host.className = 'rrg-chart'
    host.style.setProperty('--rrg-bg', '#123456')
    document.body.appendChild(host)

    const vars = collectRrgThemeVariables(host)
    expect(vars['--rrg-bg']).toBe('#123456')

    document.body.removeChild(host)
  })

  it('ships embedded export css for chart classes', () => {
    expect(RRG_CHART_EXPORT_CSS).toContain('.rrg-grid-line')
    expect(RRG_CHART_EXPORT_CSS).toContain('var(--rrg-quadrant-label)')
  })
})
