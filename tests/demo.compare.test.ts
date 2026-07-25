import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useDemoAppState } from '../demo/useDemoAppState'

describe('demo compare state', () => {
  it('keeps left/right viewport modes independent while sharing selectedDate', async () => {
    const state = useDemoAppState(
      '?scenario=farRightOutlier&compare=true&viewportLeft=fit&viewportRight=center',
    )

    expect(state.controls.value.viewportLeft).toBe('fit')
    expect(state.controls.value.viewportRight).toBe('center')
    expect(state.leftProps.value.viewportMode).toBe('fit')
    expect(state.rightProps.value.viewportMode).toBe('center')
    expect(state.leftProps.value.selectedDate).toBe(state.rightProps.value.selectedDate)

    state.controls.value.viewportRight = 'max'
    await nextTick()
    expect(state.leftProps.value.viewportMode).toBe('fit')
    expect(state.rightProps.value.viewportMode).toBe('max')

    const nextDate = state.dates.value[0]
    state.selectedDate.value = nextDate
    await nextTick()
    expect(state.leftProps.value.selectedDate).toBe(nextDate)
    expect(state.rightProps.value.selectedDate).toBe(nextDate)
  })
})
