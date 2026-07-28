<script setup lang="ts">
import { computed } from 'vue'
import {
  RRG_PLAYBACK_DEFAULTS,
  type RrgPlaybackControlsProps,
} from '../types/rrg'
import { useRrgPlaybackControls } from '../composables/useRrgPlaybackControls'
import './RrgPlaybackControls.css'

const props = withDefaults(
  defineProps<RrgPlaybackControlsProps & { showLoopToggle?: boolean }>(),
  {
    playing: RRG_PLAYBACK_DEFAULTS.playing,
    speed: RRG_PLAYBACK_DEFAULTS.speed,
    minSpeed: RRG_PLAYBACK_DEFAULTS.minSpeed,
    maxSpeed: RRG_PLAYBACK_DEFAULTS.maxSpeed,
    loop: RRG_PLAYBACK_DEFAULTS.loop,
    speedMode: RRG_PLAYBACK_DEFAULTS.speedMode,
    labelStyle: RRG_PLAYBACK_DEFAULTS.labelStyle,
    layout: RRG_PLAYBACK_DEFAULTS.layout,
    showLoopToggle: true,
  },
)

const emit = defineEmits<{
  'update:selectedDate': [date: string]
  'update:playing': [playing: boolean]
  'update:speed': [speed: number]
  'update:loop': [loop: boolean]
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
  resolvedCopy,
  togglePlaying,
  stepBy,
  goToIndex,
  onScrubInput,
  onScrubCommit,
  nudgeSpeed,
} = useRrgPlaybackControls(props, emit)

const showTextLabels = computed(() => props.labelStyle === 'icon-text')

function toggleLoop() {
  emit('update:loop', !props.loop)
}

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
    :class="{
      'rrg-playback--stacked': layout === 'stacked',
      'rrg-playback--inline': layout === 'inline',
    }"
    data-testid="rrg-playback"
    tabindex="0"
    role="group"
    :aria-label="resolvedCopy.group"
    :data-playing="playing ? 'true' : 'false'"
    :data-speed="String(clampedSpeed)"
    :data-speed-mode="speedMode"
    :data-loop="loop ? 'true' : 'false'"
    :data-label-style="labelStyle"
    :data-layout="layout"
    :data-frame-index="frameIndex >= 0 ? String(frameIndex) : undefined"
    @keydown="onKeydown"
  >
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
        :aria-label="resolvedCopy.timeline"
        @input="onScrubInput"
        @change="onScrubCommit"
        @pointerup="onScrubCommit"
      />
      <div class="rrg-playback__meta">
        <span data-testid="rrg-playback-date">{{ displayDate }}</span>
        <span data-testid="rrg-playback-frame">{{ frameLabel }}</span>
        <span v-if="loop" class="rrg-playback__loop" data-testid="rrg-playback-loop">
          {{ resolvedCopy.loop }}
        </span>
      </div>
    </div>

    <div class="rrg-playback__toolbar">
      <div class="rrg-playback__transport">
        <button
          type="button"
          class="rrg-playback__btn"
          data-testid="rrg-playback-step-back"
          :disabled="stepBackDisabled"
          :aria-label="resolvedCopy.stepBackward"
          :title="resolvedCopy.stepBackward"
          @click="stepBy(-1)"
        >
          <span aria-hidden="true">⏮</span>
          <span v-if="showTextLabels" class="rrg-playback__btn-text">{{ resolvedCopy.stepBackward }}</span>
        </button>
        <button
          type="button"
          class="rrg-playback__btn rrg-playback__btn--play"
          data-testid="rrg-playback-toggle"
          :disabled="!canInteract || (!loop && atEnd && !playing)"
          :aria-label="playing ? resolvedCopy.pause : resolvedCopy.play"
          :title="playing ? resolvedCopy.pause : resolvedCopy.play"
          @click="togglePlaying"
        >
          <span aria-hidden="true">{{ playing ? '⏸' : '▶' }}</span>
          <span v-if="showTextLabels" class="rrg-playback__btn-text">
            {{ playing ? resolvedCopy.pause : resolvedCopy.play }}
          </span>
        </button>
        <button
          type="button"
          class="rrg-playback__btn"
          data-testid="rrg-playback-step-forward"
          :disabled="stepForwardDisabled"
          :aria-label="resolvedCopy.stepForward"
          :title="resolvedCopy.stepForward"
          @click="stepBy(1)"
        >
          <span aria-hidden="true">⏭</span>
          <span v-if="showTextLabels" class="rrg-playback__btn-text">{{ resolvedCopy.stepForward }}</span>
        </button>
      </div>

      <div class="rrg-playback__speed" data-testid="rrg-playback-speed">
        <button
          v-if="showLoopToggle"
          type="button"
          class="rrg-playback__btn"
          :class="{ 'rrg-playback__btn--loop-on': loop }"
          data-testid="rrg-playback-loop-toggle"
          :aria-pressed="loop ? 'true' : 'false'"
          :aria-label="resolvedCopy.loop"
          :title="resolvedCopy.loop"
          @click="toggleLoop"
        >
          <span aria-hidden="true">↻</span>
          <span v-if="showTextLabels" class="rrg-playback__btn-text">{{ resolvedCopy.loop }}</span>
        </button>
        <button
          type="button"
          class="rrg-playback__btn"
          data-testid="rrg-playback-speed-down"
          :aria-label="resolvedCopy.decreaseSpeed"
          :title="resolvedCopy.decreaseSpeed"
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
          :aria-label="resolvedCopy.increaseSpeed"
          :title="resolvedCopy.increaseSpeed"
          :disabled="clampedSpeed >= maxSpeed"
          @click="nudgeSpeed(0.5)"
        >
          +
        </button>
      </div>
    </div>

    <div v-if="$slots.context" class="rrg-playback__context" data-testid="rrg-playback-context">
      <slot name="context" />
    </div>
  </div>
</template>
