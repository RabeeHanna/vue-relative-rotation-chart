import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  RrgChart,
  RrgChartControlsPanel,
  mergeChartCopy,
  mergeControlsCopy,
} from '../src'
import { mockSeries } from '../src/scenarios'

const spanishChartCopy = mergeChartCopy({
  leading: 'Liderazgo',
  weakening: 'Debilitamiento',
  lagging: 'Rezago',
  improving: 'Mejora',
  rsRatio: 'Ratio RS',
  rsMomentum: 'Momento RS',
  quadrant: 'Cuadrante',
  chartTitle: 'Gráfico RRG — {date}',
  chartDescription: 'Gráfico con {count} valores en {date}.',
  emptyAllHidden: 'Todas las series están ocultas',
  emptyNoDates: 'Sin fechas para mostrar',
  axisTitleX: 'Ratio RS →',
  axisTitleY: 'Momento RS ↑',
})

const spanishControlsCopy = mergeControlsCopy({
  viewportSection: 'Vista',
  displaySection: 'Pantalla',
  seriesSection: 'Series',
  showAll: 'Mostrar todo',
  hideAll: 'Ocultar todo',
  restore: 'Restaurar',
  solo: 'Solo',
  tail: 'Cola',
  labels: 'Etiquetas',
  tailFade: 'Desvanecer cola',
  viewportFit: 'Ajustar',
})

describe('localization contract', () => {
  it('deep-merges partial chart and controls copy with defaults', () => {
    const chart = mergeChartCopy({ leading: 'Lider' })
    const controls = mergeControlsCopy({ showAll: 'Todos' })
    expect(chart.weakening).toBe('Weakening')
    expect(controls.hideAll).toBe('Hide all')
  })

  it('applies custom empty-state and axis copy on the chart', () => {
    const hidden = mockSeries.map((item) => ({ ...item, visible: false }))
    const wrapper = mount(RrgChart, {
      props: {
        series: hidden,
        selectedDate: '2024-03-01',
        copy: spanishChartCopy,
      },
    })

    expect(wrapper.get('[data-testid="rrg-chart-empty"]').text()).toBe(
      spanishChartCopy.emptyAllHidden,
    )

    const visibleWrapper = mount(RrgChart, {
      props: {
        series: mockSeries,
        selectedDate: '2024-03-01',
        copy: spanishChartCopy,
      },
    })
    expect(visibleWrapper.get('[data-testid="rrg-axis-label-x"]').text()).toBe(
      spanishChartCopy.axisTitleX,
    )
    expect(visibleWrapper.get('[data-testid="rrg-quadrant-leading"]').text()).toBe('Liderazgo')
  })

  it('applies controls copy to panel section titles and actions', () => {
    const wrapper = mount(RrgChartControlsPanel, {
      props: {
        series: mockSeries,
        visibleTickers: mockSeries.map((item) => item.ticker),
        viewportMode: 'fit',
        tailLength: 10,
        labelMode: 'auto',
        showTailFade: false,
        controlsCopy: spanishControlsCopy,
        sections: ['viewport', 'display', 'visibility'],
      },
    })

    expect(wrapper.text()).toContain('Vista')
    expect(wrapper.text()).toContain('Pantalla')
    expect(wrapper.text()).toContain('Mostrar todo')
    expect(wrapper.text()).toContain('Solo')
    expect(wrapper.text()).not.toContain('Show all')
  })

  it('uses formatters for axis ticks and tooltip numbers', async () => {
    const wrapper = mount(RrgChart, {
      props: {
        series: mockSeries.slice(0, 1),
        selectedDate: '2024-03-01',
        copy: spanishChartCopy,
        formatters: {
          formatNumber: (value) => `N${value}`,
          formatAxisTick: (value) => `T${value}`,
        },
      },
    })

    expect(wrapper.get('[data-testid="rrg-x-ticks"]').text()).toMatch(/T\d/)
    await wrapper.get('[data-testid="rrg-point-XLK"] .rrg-point-hit').trigger('pointerenter')
    expect(wrapper.get('[data-testid="rrg-tooltip"]').text()).toMatch(/N\d/)
  })

  it('does not leak default English for covered chart + control strings', () => {
    const wrapper = mount(RrgChartControlsPanel, {
      props: {
        series: mockSeries,
        visibleTickers: mockSeries.map((item) => item.ticker),
        viewportMode: 'fit',
        tailLength: 10,
        labelMode: 'auto',
        showTailFade: false,
        controlsCopy: spanishControlsCopy,
        sections: ['visibility'],
      },
    })

    const chart = mount(RrgChart, {
      props: {
        series: mockSeries,
        selectedDate: '2024-03-01',
        copy: spanishChartCopy,
      },
    })

    const text = `${wrapper.text()} ${chart.get('[data-testid="rrg-quadrants"]').text()} ${chart.get('[data-testid="rrg-axis-label-x"]').text()}`
    for (const phrase of ['Show all', 'Hide all', 'Weakening', 'RS-Ratio →']) {
      expect(text).not.toContain(phrase)
    }
  })
})
