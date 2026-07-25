import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { RrgChart, RrgPlaybackControls, formatCopy, mergeChartCopy } from '../src'

const series = [
  {
    ticker: 'XLK',
    label: 'XLK',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 104, y: 103, quadrant: 'leading' as const },
    ],
  },
]

describe('copy overrides', () => {
  it('merges chart copy and formats placeholders', () => {
    const copy = mergeChartCopy({ leading: 'Lider', chartTitle: 'RRG {date}' })
    expect(copy.leading).toBe('Lider')
    expect(copy.weakening).toBe('Weakening')
    expect(formatCopy(copy.chartTitle, { date: '2024-03-01' })).toBe('RRG 2024-03-01')
  })

  it('applies quadrant and tooltip copy on the chart', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series,
        selectedDate: '2024-03-01',
        copy: {
          leading: 'Liderazgo',
          rsRatio: 'Ratio RS',
          rsMomentum: 'Mom RS',
        },
      },
    })

    expect(wrapper.get('[data-testid="rrg-quadrant-leading"]').text()).toBe('Liderazgo')

    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerenter')
    const tip = wrapper.get('[data-testid="rrg-tooltip"]').text()
    expect(tip).toContain('Ratio RS')
    expect(tip).toContain('Mom RS')
    expect(tip).toContain('Liderazgo')
  })

  it('applies playback copy to labels', () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates: ['2024-01-01', '2024-03-01'],
        selectedDate: '2024-03-01',
        copy: {
          play: 'Reproducir',
          loop: 'Bucle',
          frame: 'Cuadro {current}/{total}',
        },
      },
    })

    expect(wrapper.get('[data-testid="rrg-playback-toggle"]').attributes('aria-label')).toBe(
      'Reproducir',
    )
    expect(wrapper.get('[data-testid="rrg-playback-loop"]').text()).toBe('Bucle')
    expect(wrapper.get('[data-testid="rrg-playback-frame"]').text()).toBe('Cuadro 2/2')
  })
})
