<script setup lang="ts">
import { RrgPlaybackControls } from '../src'
import DemoAgentStatePanel from './DemoAgentStatePanel.vue'
import DemoChartHost from './DemoChartHost.vue'
import DemoControls from './DemoControls.vue'
import DemoPerfPanel from './DemoPerfPanel.vue'
import { useDemoAppState } from './useDemoAppState'
import { partialCopyFromFields } from './demoCopyFields'
import './DemoApp.css'

const {
  controls,
  dates,
  selectedDate,
  playing,
  speed,
  hovered,
  copyStatus,
  hostStyle,
  themeStyle,
  dark,
  dataNotInLink,
  summaryTitle,
  summaryDesc,
  snippet,
  singleProps,
  leftProps,
  rightProps,
  onCopySnippet,
  onCopyData,
  onApplyJson,
  onGenerate,
  agentMode,
  agentState,
} = useDemoAppState()
</script>

<template>
  <main class="demo" data-testid="demo-app">
    <header>
      <h1>vue-relative-rotation-chart</h1>
      <p>Renderer only — data and calculations are supplied by the caller.</p>
    </header>

    <DemoControls
      v-model="controls"
      :snippet="snippet"
      :summary-title="summaryTitle"
      :summary-desc="summaryDesc"
      :data-not-in-link="dataNotInLink"
      @copy-snippet="onCopySnippet"
      @copy-data="onCopyData"
      @apply-json="onApplyJson"
      @generate="onGenerate"
    />

    <DemoPerfPanel />

    <p v-if="copyStatus" class="copy-status" data-testid="demo-copy-status">{{ copyStatus }}</p>

    <DemoChartHost
      :compare="controls.compare"
      :dark="dark"
      :host-style="hostStyle"
      :theme-style="themeStyle"
      :single-props="singleProps"
      :left-props="leftProps"
      :right-props="rightProps"
      @point-hover="hovered = $event"
      @point-leave="hovered = null"
    />

    <RrgPlaybackControls
      :class="{ dark }"
      :dates="dates"
      v-model:selected-date="selectedDate"
      v-model:playing="playing"
      v-model:speed="speed"
      :loop="controls.playbackLoop"
      :min-speed="controls.minSpeed"
      :max-speed="controls.maxSpeed"
      :speed-mode="controls.speedMode"
      :copy="partialCopyFromFields(controls.playbackCopy)"
    />

    <p class="hover-chip" data-testid="demo-hover-chip">
      Hover: {{ hovered ? `${hovered.ticker} @ ${hovered.date}` : 'none' }}
    </p>

    <DemoAgentStatePanel v-if="agentMode" :state="agentState" />
  </main>
</template>
