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

  it('sorts custom presets and inserts the exact current value', () => {
    const wrapper = mount(RrgDisplaySettingsControls, {
      props: {
        tailLength: 10.5,
        labelMode: 'auto',
        showTailFade: true,
        tailLengthPresets: [24, 16, 8],
      },
    })

    const options = wrapper.get('[data-testid="rrg-display-tail-length"]').findAll('option')
    expect(options.map((o) => o.text())).toEqual(['8', '10.5', '16', '24'])
    expect((wrapper.get('[data-testid="rrg-display-tail-length"]').element as HTMLSelectElement).value).toBe(
      '10.5',
    )
  })

  it('selects the chart default from shared presets', () => {
    const wrapper = mount(RrgDisplaySettingsControls, {
      props: {
        tailLength: 10,
        labelMode: 'auto',
        showTailFade: false,
      },
    })

    const options = wrapper.get('[data-testid="rrg-display-tail-length"]').findAll('option')
    expect(options.map((o) => o.text())).toEqual(['4', '8', '10', '12', '16', '24'])
    expect((wrapper.get('[data-testid="rrg-display-tail-length"]').element as HTMLSelectElement).value).toBe(
      '10',
    )
  })

  it('inserts a custom tail length into the select options', () => {
    const wrapper = mount(RrgDisplaySettingsControls, {
      props: {
        tailLength: 15,
        labelMode: 'auto',
        showTailFade: false,
      },
    })

    const options = wrapper
      .get('[data-testid="rrg-display-tail-length"]')
      .findAll('option')
      .map((o) => o.text())
    expect(options).toContain('15')
    expect((wrapper.get('[data-testid="rrg-display-tail-length"]').element as HTMLSelectElement).value).toBe(
      '15',
    )
  })
})
