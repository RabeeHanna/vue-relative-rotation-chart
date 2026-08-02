<script setup lang="ts">
import { RrgChartControlsPanel, RrgPlaybackControls } from '../src'
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
  showPerfPanel,
  series,
  visibleTickers,
} = useDemoAppState()
</script>

<template>
  <div class="demo" data-testid="demo-app">
    <DemoControls
      section="simple"
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

    <RrgChartControlsPanel
      v-if="!controls.compare"
      v-model:viewport-mode="controls.viewportMode"
      v-model:tail-length="controls.tailLength"
      v-model:label-mode="controls.labelMode"
      v-model:show-tail-fade="controls.showTailFade"
      v-model:visible-tickers="visibleTickers"
      class="demo-chart-controls"
      :dark="dark"
      :series="series"
      :display-disabled="controls.fullHistoryTail"
    />

    <DemoChartHost
      :compare="controls.compare"
      :dark="dark"
      :host-style="hostStyle"
      :theme-style="themeStyle"
      :single-props="singleProps"
      :left-props="leftProps"
      :right-props="rightProps"
      v-model:visible-tickers="visibleTickers"
      @point-hover="hovered = $event"
      @point-leave="hovered = null"
    />

    <RrgPlaybackControls
      :class="{ dark }"
      :dates="dates"
      v-model:selected-date="selectedDate"
      v-model:playing="playing"
      v-model:speed="speed"
      v-model:loop="controls.playbackLoop"
      :min-speed="controls.minSpeed"
      :max-speed="controls.maxSpeed"
      :speed-mode="controls.speedMode"
      :copy="partialCopyFromFields(controls.playbackCopy)"
    />

    <DemoControls
      section="customize"
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

    <DemoPerfPanel v-if="showPerfPanel" />

    <p v-if="copyStatus" class="copy-status" data-testid="demo-copy-status">{{ copyStatus }}</p>

    <p v-if="!agentMode" class="hover-chip" data-testid="demo-hover-chip">
      Hover: {{ hovered ? `${hovered.ticker} @ ${hovered.date}` : 'none' }}
    </p>

    <DemoAgentStatePanel v-if="agentMode" :state="agentState" />
  </div>
</template>
