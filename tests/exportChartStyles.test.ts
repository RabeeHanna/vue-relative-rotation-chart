import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'
import {
  applyThemeVariablesToClone,
  RRG_THEME_VARIABLE_NAMES,
} from '../src/utils/exportChartStyles'

describe('exportChartStyles', () => {
  it('copies resolved custom properties onto the cloned svg root', () => {
    const host = document.createElement('div')
    host.className = 'rrg-chart'
    host.style.setProperty('--rrg-bg', '#123456')
    host.style.setProperty('--rrg-grid', 'rgba(255, 0, 0, 0.2)')
    document.body.appendChild(host)

    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    applyThemeVariablesToClone(clone, host)

    expect(clone.style.getPropertyValue('--rrg-bg').trim()).toBe('#123456')
    expect(clone.style.getPropertyValue('--rrg-grid').trim()).toBe('rgba(255, 0, 0, 0.2)')

    document.body.removeChild(host)
  })

  it('merges theme variables without replacing an existing svg style attribute', () => {
    const host = document.createElement('div')
    host.style.setProperty('--rrg-bg', '#abcdef')
    document.body.appendChild(host)

    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    clone.setAttribute('style', 'opacity:0.9')
    applyThemeVariablesToClone(clone, host)

    expect(clone.style.opacity).toBe('0.9')
    expect(clone.style.getPropertyValue('--rrg-bg').trim()).toBe('#abcdef')

    document.body.removeChild(host)
  })

  it('lists every chart theme token used by svg presentation attributes', () => {
    expect(RRG_THEME_VARIABLE_NAMES).toContain('--rrg-grid')
    expect(RRG_THEME_VARIABLE_NAMES).toContain('--rrg-quadrant-label')
    expect(RRG_THEME_VARIABLE_NAMES).toContain('--rrg-font-family')
  })

  it('reads inline theme variables from a mounted chart host', () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: [
          {
            ticker: 'XLK',
            label: 'XLK',
            points: [{ date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const }],
          },
        ],
        selectedDate: '2024-03-01',
        width: 320,
        height: 240,
      },
    })

    const host = wrapper.get('[data-testid="rrg-chart"]').element as HTMLElement
    host.style.setProperty('--rrg-bg', '#242424')
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    applyThemeVariablesToClone(clone, host)

    expect(clone.style.getPropertyValue('--rrg-bg').trim()).toBe('#242424')
  })
})
