/**
 * Coalesce rapid scrub indices to at most one flush per animation frame (CX §9).
 * Latest scheduled index wins; caller owns side effects (emit / pause).
 */
export function createScrubCoalesce(flush: (index: number) => void): {
  schedule: (index: number) => void
  flushNow: () => void
  cancel: () => void
} {
  let pending: number | null = null
  let rafId: number | null = null

  function clearRaf() {
    if (rafId == null) return
    cancelAnimationFrame(rafId)
    rafId = null
  }

  function schedule(index: number) {
    pending = index
    if (rafId != null) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      const next = pending
      pending = null
      if (next != null) flush(next)
    })
  }

  function flushNow() {
    clearRaf()
    const next = pending
    pending = null
    if (next != null) flush(next)
  }

  function cancel() {
    clearRaf()
    pending = null
  }

  return { schedule, flushNow, cancel }
}
