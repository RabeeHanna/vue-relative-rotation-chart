import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RrgPlaybackTransportIcon from '../src/components/RrgPlaybackTransportIcon.vue'
import type { RrgPlaybackTransportIconName } from '../src/components/RrgPlaybackTransportIcon.vue'

const names: RrgPlaybackTransportIconName[] = [
  'skip-back',
  'play',
  'pause',
  'skip-forward',
  'loop',
]

describe('RrgPlaybackTransportIcon', () => {
  it.each(names)('renders an SVG for %s', (name) => {
    const wrapper = mount(RrgPlaybackTransportIcon, { props: { name } })
    const svg = wrapper.find('svg.rrg-playback__icon')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
    expect(svg.find('path').exists()).toBe(true)
  })
})
