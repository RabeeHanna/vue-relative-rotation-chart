import { computed, toRef, watch } from 'vue'
import type { RrgPlaybackControlsProps } from '../types/rrg'
import { formatCopy, mergePlaybackCopy } from '../types/copy'
import { useRrgPlayback } from './useRrgPlayback'
import { useScrubDatePreview } from './useScrubDatePreview'
import {
  clampSpeed,
  nextFrameIndex,
  playbackFrameStep,
  playbackTickRate,
  prevFrameIndex,
  skipFrameIndex,
  snapDateIndex,
} from '../utils/playback'

export type PlaybackControlsEmit = {
  (e: 'update:selectedDate', date: string): void
  (e: 'update:playing', playing: boolean): void
  (e: 'update:speed', speed: number): void
}

type ResolvedProps = Required<
  Pick<
    RrgPlaybackControlsProps,
    'dates' | 'selectedDate' | 'playing' | 'speed' | 'minSpeed' | 'maxSpeed' | 'loop' | 'speedMode'
  >
> &
  Pick<RrgPlaybackControlsProps, 'copy'>

/** Controlled playback transport + rAF play loop + CX scrub coalesce. */
export function useRrgPlaybackControls(props: ResolvedProps, emit: PlaybackControlsEmit) {
  const frameIndex = computed(() => snapDateIndex(props.dates, props.selectedDate))
  const frameCount = computed(() => props.dates.length)
  const resolvedCopy = computed(() => mergePlaybackCopy(props.copy))
  const { effectiveIndex, clearPreview, onScrubInput, onScrubCommit } = useScrubDatePreview({
    frameIndex,
    dates: computed(() => props.dates),
    playing: computed(() => props.playing),
    emitPlaying: (playing) => emit('update:playing', playing),
    emitDate: (date) => emit('update:selectedDate', date),
  })

  const canInteract = computed(() => frameCount.value > 1)
  const atStart = computed(() => effectiveIndex.value <= 0)
  const atEnd = computed(() => effectiveIndex.value >= frameCount.value - 1)
  const stepBackDisabled = computed(() => !canInteract.value || (!props.loop && atStart.value))
  const stepForwardDisabled = computed(() => !canInteract.value || (!props.loop && atEnd.value))
  const clampedSpeed = computed(() => clampSpeed(props.speed, props.minSpeed, props.maxSpeed))
  const speedLabel = computed(() => `${clampedSpeed.value}x`)
  const displayDate = computed(() =>
    frameCount.value === 0 || effectiveIndex.value < 0
      ? props.selectedDate || '—'
      : props.dates[effectiveIndex.value],
  )
  const frameLabel = computed(() =>
    formatCopy(resolvedCopy.value.frame, {
      current: frameCount.value === 0 ? '—' : effectiveIndex.value + 1,
      total: frameCount.value === 0 ? '—' : frameCount.value,
    }),
  )
  const tickRate = computed(() => playbackTickRate(clampedSpeed.value, props.speedMode))
  const frameStep = computed(() => playbackFrameStep(clampedSpeed.value, props.speedMode))

  function goToIndex(index: number) {
    if (index < 0 || index >= props.dates.length) return
    clearPreview()
    emit('update:selectedDate', props.dates[index])
  }

  watch(
    () => [props.dates, props.selectedDate] as const,
    () => {
      if (!props.dates.length) return
      const snapped = props.dates[snapDateIndex(props.dates, props.selectedDate)]
      if (snapped && snapped !== props.selectedDate) emit('update:selectedDate', snapped)
    },
    { immediate: true },
  )
  watch(
    () => props.speed,
    (speed) => {
      const next = clampSpeed(speed, props.minSpeed, props.maxSpeed)
      if (next !== speed) emit('update:speed', next)
    },
    { immediate: true },
  )

  function togglePlaying() {
    const next = !props.playing
    if (next && (!canInteract.value || (!props.loop && atEnd.value))) return
    clearPreview()
    emit('update:playing', next)
  }

  function stepBy(delta: -1 | 1) {
    if (!canInteract.value) return
    if (props.playing) emit('update:playing', false)
    const next =
      delta === 1
        ? nextFrameIndex(effectiveIndex.value, frameCount.value, props.loop)
        : prevFrameIndex(effectiveIndex.value, frameCount.value, props.loop)
    if (next != null) goToIndex(next)
  }

  function advanceFrame() {
    const next =
      frameStep.value <= 1
        ? nextFrameIndex(frameIndex.value, frameCount.value, props.loop)
        : skipFrameIndex(frameIndex.value, frameCount.value, props.loop, frameStep.value)
    if (next == null) emit('update:playing', false)
    else goToIndex(next)
  }

  useRrgPlayback({ playing: toRef(props, 'playing'), speed: tickRate, onFrame: advanceFrame })

  function nudgeSpeed(delta: number) {
    emit('update:speed', clampSpeed(clampedSpeed.value + delta, props.minSpeed, props.maxSpeed))
  }

  return {
    frameIndex: effectiveIndex,
    frameCount,
    canInteract,
    atEnd,
    stepBackDisabled,
    stepForwardDisabled,
    clampedSpeed,
    speedLabel,
    displayDate,
    frameLabel,
    resolvedCopy,
    togglePlaying,
    stepBy,
    goToIndex,
    onScrubInput,
    onScrubCommit,
    nudgeSpeed,
  }
}
