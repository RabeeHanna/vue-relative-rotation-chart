import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgChart from '../src/components/RrgChart.vue'

describe('RrgChart smoke', () => {
  it('mounts without errors and exposes rrg-chart test id', () => {
    const wrapper = mount(RrgChart)
    expect(wrapper.text()).toContain('RRG Chart')
    expect(wrapper.get('[data-testid="rrg-chart"]').exists()).toBe(true)
  })
})
