<script setup lang="ts">
import {
  RRG_CHART_COPY_DEFAULTS,
  RRG_PLAYBACK_COPY_DEFAULTS,
} from '../src'
import type { DemoControlsState } from './demoControlsState'

const state = defineModel<DemoControlsState>({ required: true })

const chartFields = [
  ['leading', 'Leading'],
  ['weakening', 'Weakening'],
  ['lagging', 'Lagging'],
  ['improving', 'Improving'],
  ['rsRatio', 'RS-Ratio'],
  ['rsMomentum', 'RS-Momentum'],
  ['quadrant', 'Quadrant'],
  ['chartTitle', 'Chart title ({date})'],
  ['chartDescription', 'Chart description'],
] as const

const playbackFields = [
  ['play', 'Play'],
  ['pause', 'Pause'],
  ['stepBackward', 'Step back'],
  ['stepForward', 'Step forward'],
  ['timeline', 'Timeline'],
  ['decreaseSpeed', 'Decrease speed'],
  ['increaseSpeed', 'Increase speed'],
  ['loop', 'Loop'],
  ['frame', 'Frame ({current}/{total})'],
  ['group', 'Group aria-label'],
] as const

function resetCopy() {
  for (const [key] of chartFields) state.value.chartCopy[key] = ''
  for (const [key] of playbackFields) state.value.playbackCopy[key] = ''
}
</script>

<template>
  <details
    class="copy-overrides"
    :open="state.copyOpen"
    data-testid="demo-copy-overrides"
  >
    <summary @click.prevent="state.copyOpen = !state.copyOpen">
      Copy / labels
    </summary>
    <p class="hint">
      Leave blank for defaults. Placeholders:
      <code>{date}</code>, <code>{count}</code>, <code>{viewport}</code>,
      <code>{leading}</code>, <code>{improving}</code>,
      <code>{current}</code>, <code>{total}</code>.
    </p>

    <div class="copy-grid">
      <h3>Chart</h3>
      <label v-for="[key, label] of chartFields" :key="'c-' + key">
        {{ label }}
        <input
          v-model="state.chartCopy[key]"
          type="text"
          :placeholder="RRG_CHART_COPY_DEFAULTS[key]"
          :data-testid="`demo-copy-chart-${key}`"
        />
      </label>

      <h3>Playback</h3>
      <label v-for="[key, label] of playbackFields" :key="'p-' + key">
        {{ label }}
        <input
          v-model="state.playbackCopy[key]"
          type="text"
          :placeholder="RRG_PLAYBACK_COPY_DEFAULTS[key]"
          :data-testid="`demo-copy-playback-${key}`"
        />
      </label>
    </div>

    <button type="button" data-testid="demo-copy-reset" @click="resetCopy">
      Reset copy overrides
    </button>
  </details>
</template>

<style scoped>
.copy-overrides {
  margin: 0.75rem 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.hint {
  font-size: 0.85rem;
  opacity: 0.8;
}
.copy-grid {
  display: grid;
  gap: 0.4rem;
  margin: 0.5rem 0;
}
.copy-grid h3 {
  margin: 0.5rem 0 0.15rem;
  font-size: 0.95rem;
}
.copy-grid label {
  display: grid;
  gap: 0.15rem;
  font-size: 0.85rem;
}
.copy-grid input {
  width: 100%;
  max-width: 36rem;
}
</style>
