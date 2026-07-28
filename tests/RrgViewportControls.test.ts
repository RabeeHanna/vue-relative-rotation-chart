import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgViewportControls from '../src/components/RrgViewportControls.vue'

describe('RrgViewportControls', () => {
  it('renders fit, max, and center radios bound to viewportMode', async () => {
    const wrapper = mount(RrgViewportControls, {
      props: {
        viewportMode: 'max',
      },
    })

    expect(wrapper.get('[data-testid="rrg-viewport"]').attributes('role')).toBe('radiogroup')
    expect((wrapper.get('[data-testid="rrg-viewport-max"]').element as HTMLInputElement).checked).toBe(
      true,
    )
    expect((wrapper.get('[data-testid="rrg-viewport-fit"]').element as HTMLInputElement).checked).toBe(
      false,
    )

    await wrapper.get('[data-testid="rrg-viewport-center"]').setValue(true)
    expect(wrapper.emitted('update:viewportMode')).toEqual([['center']])
  })

  it('disables inputs when disabled prop is set', () => {
    const wrapper = mount(RrgViewportControls, {
      props: {
        viewportMode: 'fit',
        disabled: true,
      },
    })

    for (const mode of ['fit', 'max', 'center'] as const) {
      expect(wrapper.get(`[data-testid="rrg-viewport-${mode}"]`).attributes('disabled')).toBeDefined()
    }
  })
})
