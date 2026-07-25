import { computed, toRef, watch } from 'vue'
import type { RrgPlaybackControlsProps } from '../types/rrg'
import { useRrgPlayback } from './useRrgPlayback'
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
>

/** Controlled playback frame/transport state + rAF advancement. */
export function useRrgPlaybackControls(props: ResolvedProps, emit: PlaybackControlsEmit) {
  const frameIndex = computed(() => snapDateIndex(props.dates, props.selectedDate))
  const frameCount = computed(() => props.dates.length)
  const canInteract = computed(() => frameCount.value > 1)
  const atStart = computed(() => frameIndex.value <= 0)
  const atEnd = computed(() => frameIndex.value >= frameCount.value - 1)
  const stepBackDisabled = computed(
    () => !canInteract.value || (!props.loop && atStart.value),
  )
  const stepForwardDisabled = computed(
    () => !canInteract.value || (!props.loop && atEnd.value),
  )
  const clampedSpeed = computed(() =>
    clampSpeed(props.speed, props.minSpeed, props.maxSpeed),
  )
  const speedLabel = computed(() => `${clampedSpeed.value}x`)
  const displayDate = computed(() =>
    frameIndex.value < 0 ? props.selectedDate || '—' : props.dates[frameIndex.value],
  )
  const frameLabel = computed(() =>
    frameCount.value === 0
      ? 'Frame —'
      : `Frame ${Math.max(frameIndex.value, 0) + 1} of ${frameCount.value}`,
  )

  /** Interval mode: fps = speed. Skip mode: 1 tick/sec, jump round(speed) frames. */
  const tickRate = computed(() => playbackTickRate(clampedSpeed.value, props.speedMode))
  const frameStep = computed(() => playbackFrameStep(clampedSpeed.value, props.speedMode))

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

  function goToIndex(index: number) {
    if (index >= 0 && index < props.dates.length) emit('update:selectedDate', props.dates[index])
  }

  function togglePlaying() {
    const next = !props.playing
    if (next && (!canInteract.value || (!props.loop && atEnd.value))) return
    emit('update:playing', next)
  }

  function stepBy(delta: -1 | 1) {
    if (!canInteract.value) return
    if (props.playing) emit('update:playing', false)
    const next =
      delta === 1
        ? nextFrameIndex(frameIndex.value, frameCount.value, props.loop)
        : prevFrameIndex(frameIndex.value, frameCount.value, props.loop)
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

  useRrgPlayback({
    playing: toRef(props, 'playing'),
    speed: tickRate,
    onFrame: advanceFrame,
  })

  function onScrubInput(event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    if (!Number.isFinite(value)) return
    if (props.playing) emit('update:playing', false)
    goToIndex(value)
  }

  function nudgeSpeed(delta: number) {
    emit(
      'update:speed',
      clampSpeed(clampedSpeed.value + delta, props.minSpeed, props.maxSpeed),
    )
  }

  return {
    frameIndex,
    frameCount,
    canInteract,
    atEnd,
    stepBackDisabled,
    stepForwardDisabled,
    clampedSpeed,
    speedLabel,
    displayDate,
    frameLabel,
    togglePlaying,
    stepBy,
    goToIndex,
    onScrubInput,
    nudgeSpeed,
  }
}
