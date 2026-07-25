import { describe, expect, it } from 'vitest'
import {
  demoChartPropsFromControls,
  effectiveDemoTailLength,
  maxSeriesPointCount,
} from '../demo/demoChartProps'
import { parseDemoUrl, serializeDemoUrl } from '../demo/demoUrl'
import { longPlayback100 } from '../src/scenarios'

describe('demo full-history tail', () => {
  it('defaults fullHistoryTail off and round-trips in the URL', () => {
    expect(parseDemoUrl('').fullHistoryTail).toBe(false)
    const on = parseDemoUrl('fullHistoryTail=true&tailLength=8')
    expect(on.fullHistoryTail).toBe(true)
    expect(on.tailLength).toBe(8)
    expect(parseDemoUrl(serializeDemoUrl(on)).fullHistoryTail).toBe(true)
  })

  it('maps effective tail length to full series history when enabled', () => {
    expect(maxSeriesPointCount(longPlayback100)).toBe(100)
    expect(effectiveDemoTailLength(8, false, longPlayback100)).toBe(8)
    expect(effectiveDemoTailLength(8, true, longPlayback100)).toBe(100)
  })

  it('passes full history into chart props when the toggle is on', () => {
    const props = demoChartPropsFromControls(
      {
        labelMode: 'hover',
        tailLength: 8,
        fullHistoryTail: true,
        tickerLabelAlwaysVisible: false,
        showTailFade: false,
        showQuadrantLabels: true,
        showGrid: true,
        showAxes: true,
        highlightedTicker: '',
        selectedTicker: '',
        pointRadius: 5.5,
        hitRadius: 12,
        size: 'default',
      },
      longPlayback100,
      longPlayback100[0].points.at(-1)!.date,
      'fit',
    )
    expect(props.tailLength).toBe(100)
  })
})
