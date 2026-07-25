<script setup lang="ts">
import {
  RRG_PLAYBACK_DEFAULTS,
  type RrgPlaybackControlsProps,
} from '../types/rrg'
import { useRrgPlaybackControls } from '../composables/useRrgPlaybackControls'
import './RrgPlaybackControls.css'

const props = withDefaults(defineProps<RrgPlaybackControlsProps>(), {
  playing: RRG_PLAYBACK_DEFAULTS.playing,
  speed: RRG_PLAYBACK_DEFAULTS.speed,
  minSpeed: RRG_PLAYBACK_DEFAULTS.minSpeed,
  maxSpeed: RRG_PLAYBACK_DEFAULTS.maxSpeed,
  loop: RRG_PLAYBACK_DEFAULTS.loop,
})

const emit = defineEmits<{
  'update:selectedDate': [date: string]
  'update:playing': [playing: boolean]
  'update:speed': [speed: number]
}>()

const {
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
} = useRrgPlaybackControls(props, emit)

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case ' ':
      event.preventDefault()
      togglePlaying()
      break
    case 'ArrowLeft':
      event.preventDefault()
      stepBy(-1)
      break
    case 'ArrowRight':
      event.preventDefault()
      stepBy(1)
      break
    case 'Home':
      event.preventDefault()
      if (props.playing) emit('update:playing', false)
      goToIndex(0)
      break
    case 'End':
      event.preventDefault()
      if (props.playing) emit('update:playing', false)
      goToIndex(frameCount.value - 1)
      break
    default:
      break
  }
}
</script>

<template>
  <div
    class="rrg-playback"
    data-testid="rrg-playback"
    tabindex="0"
    role="group"
    aria-label="Playback controls. Space play pause, arrows step, Home End jump."
    :data-playing="playing ? 'true' : 'false'"
    :data-speed="String(clampedSpeed)"
    :data-loop="loop ? 'true' : 'false'"
    :data-frame-index="frameIndex >= 0 ? String(frameIndex) : undefined"
    @keydown="onKeydown"
  >
    <div class="rrg-playback__transport">
      <button
        type="button"
        class="rrg-playback__btn"
        data-testid="rrg-playback-step-back"
        :disabled="stepBackDisabled"
        aria-label="Step backward"
        @click="stepBy(-1)"
      >
        ⏮
      </button>
      <button
        type="button"
        class="rrg-playback__btn rrg-playback__btn--play"
        data-testid="rrg-playback-toggle"
        :disabled="!canInteract || (!loop && atEnd && !playing)"
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="togglePlaying"
      >
        {{ playing ? '⏸' : '▶' }}
      </button>
      <button
        type="button"
        class="rrg-playback__btn"
        data-testid="rrg-playback-step-forward"
        :disabled="stepForwardDisabled"
        aria-label="Step forward"
        @click="stepBy(1)"
      >
        ⏭
      </button>
    </div>

    <div class="rrg-playback__timeline">
      <input
        class="rrg-playback__scrubber"
        data-testid="rrg-playback-scrubber"
        type="range"
        role="slider"
        :min="0"
        :max="Math.max(frameCount - 1, 0)"
        :step="1"
        :value="Math.max(frameIndex, 0)"
        :disabled="!canInteract"
        :aria-valuemin="0"
        :aria-valuemax="Math.max(frameCount - 1, 0)"
        :aria-valuenow="Math.max(frameIndex, 0)"
        :aria-valuetext="displayDate"
        aria-label="Timeline"
        @input="onScrubInput"
      />
      <div class="rrg-playback__meta">
        <span data-testid="rrg-playback-date">{{ displayDate }}</span>
        <span data-testid="rrg-playback-frame">{{ frameLabel }}</span>
        <span v-if="loop" class="rrg-playback__loop" data-testid="rrg-playback-loop">
          Loop
        </span>
      </div>
    </div>

    <div class="rrg-playback__speed" data-testid="rrg-playback-speed">
      <button
        type="button"
        class="rrg-playback__btn"
        data-testid="rrg-playback-speed-down"
        aria-label="Decrease speed"
        :disabled="clampedSpeed <= minSpeed"
        @click="nudgeSpeed(-0.5)"
      >
        −
      </button>
      <span class="rrg-playback__speed-label" data-testid="rrg-playback-speed-label">
        {{ speedLabel }}
      </span>
      <button
        type="button"
        class="rrg-playback__btn"
        data-testid="rrg-playback-speed-up"
        aria-label="Increase speed"
        :disabled="clampedSpeed >= maxSpeed"
        @click="nudgeSpeed(0.5)"
      >
        +
      </button>
    </div>
  </div>
</template>
