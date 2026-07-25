import { computed, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue'
import { createScrubCoalesce } from '../utils/scrubCoalesce'

type ScrubPreviewOptions = {
  frameIndex: ComputedRef<number>
  dates: Ref<string[]> | ComputedRef<string[]> | { value: string[] }
  playing: Ref<boolean> | { value: boolean }
  emitPlaying: (playing: boolean) => void
  emitDate: (date: string) => void
}

/**
 * Live scrubber preview + rAF-coalesced date emits (CX §9).
 */
export function useScrubDatePreview(options: ScrubPreviewOptions) {
  const scrubPreviewIndex = ref<number | null>(null)
  const effectiveIndex = computed(() => {
    if (scrubPreviewIndex.value != null) return scrubPreviewIndex.value
    return Math.max(options.frameIndex.value, 0)
  })

  const scrub = createScrubCoalesce((index) => {
    const dates = options.dates.value
    if (index >= 0 && index < dates.length) options.emitDate(dates[index])
  })

  watch(options.frameIndex, (idx) => {
    if (scrubPreviewIndex.value != null && scrubPreviewIndex.value === idx) {
      scrubPreviewIndex.value = null
    }
  })

  function clearPreview() {
    scrubPreviewIndex.value = null
  }

  function onScrubInput(event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    if (!Number.isFinite(value)) return
    if (options.playing.value) options.emitPlaying(false)
    scrubPreviewIndex.value = value
    scrub.schedule(value)
  }

  function onScrubCommit() {
    scrub.flushNow()
  }

  onBeforeUnmount(() => {
    scrub.flushNow()
  })

  return { effectiveIndex, clearPreview, onScrubInput, onScrubCommit }
}
