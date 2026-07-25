import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useRrgHoverState } from '../src/composables/useRrgHoverState'
import type { RrgRenderPoint } from '../src/types/rrg'

const xlk: RrgRenderPoint = {
  ticker: 'XLK',
  label: 'XLK',
  name: 'Technology',
  x: 104,
  y: 103,
  quadrant: 'leading',
  date: '2024-03-01',
}

const xlf: RrgRenderPoint = {
  ticker: 'XLF',
  label: 'XLF',
  x: 97,
  y: 98,
  quadrant: 'lagging',
  date: '2024-03-01',
}

describe('useRrgHoverState', () => {
  it('onPointEnter sets hoveredTicker and hoveredPoint', () => {
    const { hoveredTicker, hoveredPoint, onPointEnter } = useRrgHoverState()
    onPointEnter(xlk)
    expect(hoveredTicker.value).toBe('XLK')
    expect(hoveredPoint.value).toMatchObject({
      ticker: 'XLK',
      x: 104,
      y: 103,
      quadrant: 'leading',
      date: '2024-03-01',
    })
  })

  it('onPointLeave clears both', () => {
    const { hoveredTicker, hoveredPoint, onPointEnter, onPointLeave } =
      useRrgHoverState()
    onPointEnter(xlk)
    onPointLeave()
    expect(hoveredTicker.value).toBeNull()
    expect(hoveredPoint.value).toBeNull()
  })

  it('sequential enters always reflect the most recent point', () => {
    const { hoveredTicker, hoveredPoint, onPointEnter } = useRrgHoverState()
    onPointEnter(xlk)
    onPointEnter(xlf)
    expect(hoveredTicker.value).toBe('XLF')
    expect(hoveredPoint.value?.ticker).toBe('XLF')
  })

  it('keeps hoveredPoint in sync with currentPoints while ticker stays hovered', () => {
    const currentPoints = ref<RrgRenderPoint[]>([xlk])
    const { hoveredPoint, onPointEnter } = useRrgHoverState(currentPoints)
    onPointEnter(xlk)
    currentPoints.value = [
      {
        ...xlk,
        x: 110,
        y: 99,
        date: '2024-01-01',
        quadrant: 'weakening',
      },
    ]
    expect(hoveredPoint.value).toMatchObject({
      ticker: 'XLK',
      x: 110,
      y: 99,
      date: '2024-01-01',
      quadrant: 'weakening',
    })
  })
})
