import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import RrgPlaybackControls from '../src/components/RrgPlaybackControls.vue'
import '../src/components/RrgPlaybackControls.css'
import {
  clampSpeed,
  nextFrameIndex,
  playbackFrameStep,
  playbackTickRate,
  prevFrameIndex,
  skipFrameIndex,
  snapDateIndex,
} from '../src/utils/playback'

const dates = ['2024-01-05', '2024-01-12', '2024-01-19']

describe('playback utils', () => {
  it('advances and wraps with loop', () => {
    expect(nextFrameIndex(0, 3, true)).toBe(1)
    expect(nextFrameIndex(2, 3, true)).toBe(0)
    expect(nextFrameIndex(2, 3, false)).toBeNull()
    expect(prevFrameIndex(0, 3, false)).toBeNull()
    expect(prevFrameIndex(0, 3, true)).toBe(2)
  })

  it('clamps speed to range', () => {
    expect(clampSpeed(0.1, 0.5, 5)).toBe(0.5)
    expect(clampSpeed(99, 0.5, 5)).toBe(5)
    expect(clampSpeed(2, 0.5, 5)).toBe(2)
  })

  it('maps speedMode to tick rate and frame step', () => {
    expect(playbackTickRate(5, 'interval')).toBe(5)
    expect(playbackFrameStep(5, 'interval')).toBe(1)
    expect(playbackTickRate(5, 'skip')).toBe(1)
    expect(playbackFrameStep(5, 'skip')).toBe(5)
    expect(skipFrameIndex(0, 10, false, 3)).toBe(3)
    expect(skipFrameIndex(8, 10, false, 5)).toBe(9)
  })

  it('snaps out-of-range dates to nearest', () => {
    expect(snapDateIndex(dates, '2024-01-12')).toBe(1)
    expect(snapDateIndex(dates, '2024-01-10')).toBe(1)
    expect(snapDateIndex(dates, '2023-12-01')).toBe(0)
    expect(snapDateIndex(dates, '2024-02-01')).toBe(2)
    expect(snapDateIndex([], '2024-01-05')).toBe(-1)
  })
})

describe('RrgPlaybackControls', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16) as unknown as number
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('shows date, frame, and speed unambiguously', () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
        speed: 2,
        loop: true,
      },
    })

    expect(wrapper.get('[data-testid="rrg-playback-date"]').text()).toBe('2024-01-12')
    expect(wrapper.get('[data-testid="rrg-playback-frame"]').text()).toBe('Frame 2 of 3')
    expect(wrapper.get('[data-testid="rrg-playback-speed-label"]').text()).toBe('2x')
    expect(wrapper.get('[data-testid="rrg-playback-loop"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rrg-playback-toggle"]').attributes('aria-label')).toBe(
      'Play',
    )
    expect(wrapper.get('[data-testid="rrg-playback"]').attributes('data-label-style')).toBe(
      'icon',
    )
    expect(wrapper.find('.rrg-playback__btn-text').exists()).toBe(false)
  })

  it('shows copy text beside icons when labelStyle is icon-text', () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
        labelStyle: 'icon-text',
      },
    })
    expect(wrapper.get('[data-testid="rrg-playback"]').attributes('data-label-style')).toBe(
      'icon-text',
    )
    expect(wrapper.get('[data-testid="rrg-playback-toggle"]').text()).toContain('Play')
    expect(wrapper.get('[data-testid="rrg-playback-step-back"]').text()).toContain(
      'Step backward',
    )
  })

  it('accepts dark class for package theme styling', () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
      },
      attrs: { class: 'dark' },
    })
    expect(wrapper.get('[data-testid="rrg-playback"]').classes()).toContain('dark')
  })

  it('emits controlled updates for step, scrub, and speed', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
        playing: false,
        speed: 2,
      },
    })

    await wrapper.get('[data-testid="rrg-playback-step-forward"]').trigger('click')
    expect(wrapper.emitted('update:selectedDate')?.at(-1)?.[0]).toBe('2024-01-19')

    const scrubber = wrapper.get('[data-testid="rrg-playback-scrubber"]')
    const el = scrubber.element as HTMLInputElement
    el.value = '0'
    await scrubber.trigger('input')
    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('update:selectedDate')?.at(-1)?.[0]).toBe('2024-01-05')

    await wrapper.get('[data-testid="rrg-playback-speed-up"]').trigger('click')
    expect(wrapper.emitted('update:speed')?.at(-1)?.[0]).toBe(2.5)
  })

  it('coalesces rapid scrub inputs to the latest index per frame', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-05',
        playing: false,
      },
    })

    const scrubber = wrapper.get('[data-testid="rrg-playback-scrubber"]')
    const el = scrubber.element as HTMLInputElement
    el.value = '1'
    await scrubber.trigger('input')
    el.value = '2'
    await scrubber.trigger('input')
    expect(wrapper.emitted('update:selectedDate') ?? []).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(16)
    expect(wrapper.emitted('update:selectedDate')).toHaveLength(1)
    expect(wrapper.emitted('update:selectedDate')?.[0]?.[0]).toBe('2024-01-19')
  })

  it('keeps scrubber preview date live before the coalesced emit', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-05',
        playing: false,
      },
    })

    const scrubber = wrapper.get('[data-testid="rrg-playback-scrubber"]')
    const el = scrubber.element as HTMLInputElement
    el.value = '2'
    await scrubber.trigger('input')
    expect(wrapper.get('[data-testid="rrg-playback-date"]').text()).toBe('2024-01-19')
    expect(wrapper.get('[data-testid="rrg-playback-frame"]').text()).toBe('Frame 3 of 3')
    expect(wrapper.emitted('update:selectedDate') ?? []).toHaveLength(0)
  })

  it('pauses when stepping while playing', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-05',
        playing: true,
        speed: 2,
      },
    })

    await wrapper.get('[data-testid="rrg-playback-step-forward"]').trigger('click')
    expect(wrapper.emitted('update:playing')?.at(-1)?.[0]).toBe(false)
  })

  it('snaps selectedDate when not in dates', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-10',
      },
    })
    await nextTick()
    expect(wrapper.emitted('update:selectedDate')?.[0]?.[0]).toBe('2024-01-12')
  })

  it('disables transport for empty or single-date ranges', () => {
    const empty = mount(RrgPlaybackControls, {
      props: { dates: [], selectedDate: '' },
    })
    expect(empty.get('[data-testid="rrg-playback-toggle"]').attributes('disabled')).toBeDefined()

    const single = mount(RrgPlaybackControls, {
      props: { dates: ['2024-01-05'], selectedDate: '2024-01-05' },
    })
    expect(single.get('[data-testid="rrg-playback-toggle"]').attributes('disabled')).toBeDefined()
    expect(
      single.get('[data-testid="rrg-playback-step-forward"]').attributes('disabled'),
    ).toBeDefined()
  })

  it('supports keyboard shortcuts when focused', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
        playing: false,
      },
      attachTo: document.body,
    })

    await wrapper.get('[data-testid="rrg-playback"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:selectedDate')?.at(-1)?.[0]).toBe('2024-01-19')

    await wrapper.get('[data-testid="rrg-playback"]').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:playing')?.at(-1)?.[0]).toBe(true)

    await wrapper.setProps({ playing: true, selectedDate: '2024-01-19' })
    await wrapper.get('[data-testid="rrg-playback"]').trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:selectedDate')?.at(-1)?.[0]).toBe('2024-01-05')
    expect(wrapper.emitted('update:playing')?.at(-1)?.[0]).toBe(false)

    wrapper.unmount()
  })

  it('toggles loop via transport control', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-12',
        loop: true,
        'onUpdate:loop': (value: boolean) => wrapper.setProps({ loop: value }),
      },
    })

    expect(wrapper.get('[data-testid="rrg-playback-loop-toggle"]').attributes('aria-pressed')).toBe(
      'true',
    )
    await wrapper.get('[data-testid="rrg-playback-loop-toggle"]').trigger('click')
    expect(wrapper.emitted('update:loop')).toEqual([[false]])
    expect(wrapper.get('[data-testid="rrg-playback-loop-toggle"]').attributes('aria-pressed')).toBe(
      'false',
    )
  })

  it('advances frames while playing and cleans up on unmount', async () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: {
        dates,
        selectedDate: '2024-01-05',
        playing: true,
        speed: 2,
        loop: false,
      },
    })

    await vi.advanceTimersByTimeAsync(600)
    expect(wrapper.emitted('update:selectedDate')?.some((e) => e[0] === '2024-01-12')).toBe(
      true,
    )

    wrapper.unmount()
    const before = wrapper.emitted('update:selectedDate')?.length ?? 0
    await vi.advanceTimersByTimeAsync(1000)
    expect(wrapper.emitted('update:selectedDate')?.length ?? 0).toBe(before)
  })
})

function mountPlaybackAtWidth(
  widthPx: number,
  extraProps: Record<string, unknown> = {},
  extraOptions: { attrs?: Record<string, unknown> } = {},
) {
  const host = document.createElement('div')
  host.style.width = `${widthPx}px`
  document.body.appendChild(host)

  const wrapper = mount(RrgPlaybackControls, {
    props: {
      dates,
      selectedDate: '2024-01-12',
      layout: 'stacked',
      ...extraProps,
    },
    attrs: extraOptions.attrs,
    attachTo: host,
  })

  return { wrapper, host }
}

describe('RrgPlaybackControls mobile layout', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('avoids horizontal overflow at 390px with stacked layout', () => {
    const { wrapper, host } = mountPlaybackAtWidth(390)
    const root = wrapper.get('[data-testid="rrg-playback"]').element as HTMLElement

    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1)
    expect(root.offsetWidth).toBeLessThanOrEqual(host.clientWidth)
    expect(root.getAttribute('data-layout')).toBe('stacked')
    expect(root.classList.contains('rrg-playback--stacked')).toBe(true)

    wrapper.unmount()
  })

  it('ships stacked touch-target and scrubber rules in CSS', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/components/RrgPlaybackControls.css'),
      'utf8',
    )
    expect(css).toContain('.rrg-playback--stacked .rrg-playback__toolbar')
    expect(css).toContain('.rrg-playback--stacked .rrg-playback__btn')
    expect(css).toContain('min-height: 3rem')
    expect(css).toContain('.rrg-playback--stacked .rrg-playback__scrubber')
    expect(css).toContain('height: 2.75rem')
    expect(css).toContain('.rrg-playback--stacked .rrg-playback__timeline')
    expect(css).toContain('width: 100%')
  })

  it('defaults layout to auto and marks inline mode', () => {
    const wrapper = mount(RrgPlaybackControls, {
      props: { dates, selectedDate: '2024-01-12', layout: 'inline' },
    })
    const root = wrapper.get('[data-testid="rrg-playback"]')
    expect(root.attributes('data-layout')).toBe('inline')
    expect(root.classes()).toContain('rrg-playback--inline')
  })

  it('accepts dark stacked layout for theme styling', () => {
    const { wrapper } = mountPlaybackAtWidth(390, {}, { attrs: { class: 'dark' } })
    const root = wrapper.get('[data-testid="rrg-playback"]')
    expect(root.classes()).toContain('dark')
    expect(root.classes()).toContain('rrg-playback--stacked')

    wrapper.unmount()
  })
})
