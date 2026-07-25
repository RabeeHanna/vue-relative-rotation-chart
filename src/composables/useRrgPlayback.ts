import { onBeforeUnmount, watch, type Ref } from 'vue'

type PlaybackLoopOptions = {
  playing: Ref<boolean>
  /** Frames per second */
  speed: Ref<number>
  onFrame: () => void
}

/**
 * rAF playback ticker. Advances via timestamp delta; does not catch up after
 * background throttling. Cleans up on pause and unmount.
 */
export function useRrgPlayback(options: PlaybackLoopOptions): {
  stop: () => void
} {
  let rafId: number | null = null
  let lastTs: number | null = null
  let accMs = 0

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    lastTs = null
    accMs = 0
  }

  function tick(ts: number) {
    if (!options.playing.value) {
      stop()
      return
    }

    if (lastTs == null) {
      lastTs = ts
    } else {
      const dt = ts - lastTs
      lastTs = ts
      // Ignore huge gaps (tab backgrounded / sleep) — no catch-up
      if (dt > 0 && dt < 250) {
        accMs += dt
        const interval = 1000 / Math.max(options.speed.value, 0.01)
        while (accMs >= interval) {
          accMs -= interval
          options.onFrame()
          if (!options.playing.value) {
            stop()
            return
          }
        }
      } else if (dt >= 250) {
        lastTs = ts
        accMs = 0
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  function start() {
    stop()
    if (!options.playing.value) return
    rafId = requestAnimationFrame(tick)
  }

  watch(
    () => options.playing.value,
    (playing) => {
      if (playing) start()
      else stop()
    },
    { immediate: true },
  )

  watch(
    () => options.speed.value,
    () => {
      // Apply immediately mid-playback; reset accumulator for clean cadence
      accMs = 0
    },
  )

  onBeforeUnmount(stop)

  return { stop }
}
