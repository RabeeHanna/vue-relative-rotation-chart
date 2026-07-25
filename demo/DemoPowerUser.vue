<script setup lang="ts">
import type { DemoControlsState } from './demoControlsState'

const state = defineModel<DemoControlsState>({ required: true })
</script>

<template>
  <div class="adv-block" data-testid="demo-power-user">
    <h3>Power user</h3>
    <label>
      Selected ticker
      <input v-model="state.selectedTicker" type="text" data-testid="demo-selected-ticker" />
    </label>
    <label>
      Min speed
      <input
        v-model.number="state.minSpeed"
        type="number"
        min="0.25"
        max="4"
        step="0.25"
        data-testid="demo-min-speed"
      />
    </label>
    <label>
      Max speed
      <input
        v-model.number="state.maxSpeed"
        type="number"
        min="1"
        max="16"
        step="0.5"
        data-testid="demo-max-speed"
      />
    </label>
    <label>
      Speed mode
      <select v-model="state.speedMode" data-testid="demo-speed-mode">
        <option value="interval">shorter intervals</option>
        <option value="skip">skip frames</option>
      </select>
    </label>
    <label>
      Point r
      <input
        v-model.number="state.pointRadius"
        type="number"
        min="2"
        max="16"
        step="0.5"
        data-testid="demo-point-radius"
      />
    </label>
    <label>
      Hit r
      <input
        v-model.number="state.hitRadius"
        type="number"
        min="4"
        max="32"
        step="1"
        data-testid="demo-hit-radius"
      />
    </label>
    <label>
      --rrg-bg
      <input v-model="state.cssBg" type="color" data-testid="demo-css-bg" />
    </label>
    <label>
      --rrg-label
      <input v-model="state.cssLabel" type="color" data-testid="demo-css-label" />
    </label>
    <label>
      --rrg-grid
      <input v-model="state.cssGrid" type="color" data-testid="demo-css-grid" />
    </label>
  </div>
</template>
