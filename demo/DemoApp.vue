<script setup lang="ts">
import { RrgPlaybackControls } from '../src'
import DemoChartHost from './DemoChartHost.vue'
import DemoControls from './DemoControls.vue'
import { useDemoAppState } from './useDemoAppState'
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
} = useDemoAppState()
</script>

<template>
  <main class="demo" :class="{ dark }" data-testid="demo-app">
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

    <p v-if="copyStatus" class="copy-status" data-testid="demo-copy-status">{{ copyStatus }}</p>

    <DemoChartHost
      :compare="controls.compare"
      :dark="dark"
      :host-style="hostStyle"
      :single-props="singleProps"
      :left-props="leftProps"
      :right-props="rightProps"
      @point-hover="hovered = $event"
      @point-leave="hovered = null"
    />

    <RrgPlaybackControls
      :dates="dates"
      v-model:selected-date="selectedDate"
      v-model:playing="playing"
      v-model:speed="speed"
    />

    <p class="hover-chip" data-testid="demo-hover-chip">
      Hover: {{ hovered ? `${hovered.ticker} @ ${hovered.date}` : 'none' }}
    </p>
  </main>
</template>
