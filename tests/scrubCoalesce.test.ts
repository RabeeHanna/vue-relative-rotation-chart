import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createScrubCoalesce } from '../src/utils/scrubCoalesce'

describe('createScrubCoalesce', () => {
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

  it('flushes only the latest index once per animation frame', async () => {
    const flush = vi.fn()
    const scrub = createScrubCoalesce(flush)

    scrub.schedule(1)
    scrub.schedule(4)
    scrub.schedule(7)
    expect(flush).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(16)
    expect(flush).toHaveBeenCalledTimes(1)
    expect(flush).toHaveBeenCalledWith(7)
  })

  it('flushNow emits pending immediately and cancel drops it', async () => {
    const flush = vi.fn()
    const scrub = createScrubCoalesce(flush)

    scrub.schedule(3)
    scrub.flushNow()
    expect(flush).toHaveBeenCalledWith(3)

    scrub.schedule(5)
    scrub.cancel()
    await vi.advanceTimersByTimeAsync(16)
    expect(flush).toHaveBeenCalledTimes(1)
  })
})
