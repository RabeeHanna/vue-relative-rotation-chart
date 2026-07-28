import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgDisplaySettingsControls from '../src/components/RrgDisplaySettingsControls.vue'

describe('RrgDisplaySettingsControls', () => {
  it('binds tail length, label mode, and tail fade', async () => {
    const wrapper = mount(RrgDisplaySettingsControls, {
      props: {
        tailLength: 8,
        labelMode: 'auto',
        showTailFade: true,
        'onUpdate:tailLength': (value: number) => wrapper.setProps({ tailLength: value }),
        'onUpdate:labelMode': (value: 'hover') => wrapper.setProps({ labelMode: value }),
        'onUpdate:showTailFade': (value: boolean) => wrapper.setProps({ showTailFade: value }),
      },
    })

    await wrapper.get('[data-testid="rrg-display-label-mode"]').setValue('hover')
    expect(wrapper.emitted('update:labelMode')).toEqual([['hover']])

    await wrapper.get('[data-testid="rrg-display-tail-length"]').setValue('12')
    expect(wrapper.emitted('update:tailLength')).toEqual([[12]])

    await wrapper.get('[data-testid="rrg-display-tail-fade"]').setValue(false)
    expect(wrapper.emitted('update:showTailFade')).toEqual([[false]])
  })

  it('renders custom tail presets', () => {
    const wrapper = mount(RrgDisplaySettingsControls, {
      props: {
        tailLength: 6,
        labelMode: 'auto',
        showTailFade: true,
        tailLengthPresets: [6, 10],
      },
    })

    const options = wrapper.get('[data-testid="rrg-display-tail-length"]').findAll('option')
    expect(options.map((o) => o.text())).toEqual(['6', '10'])
  })
})
