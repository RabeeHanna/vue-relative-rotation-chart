<script setup lang="ts">
import { RrgChart, type RrgChartProps, type RrgRenderPoint } from '../src'
import { DEMO_CHART_REGION_ID } from './chartRegionId'

defineProps<{
  compare: boolean
  leftProps: RrgChartProps
  rightProps: RrgChartProps
  singleProps: RrgChartProps
  dark: boolean
  hostStyle?: Record<string, string>
  themeStyle?: Record<string, string>
  chartRegionId?: string
}>()

const visibleTickers = defineModel<string[]>('visibleTickers')

const emit = defineEmits<{
  pointHover: [point: RrgRenderPoint]
  pointLeave: []
}>()
</script>

<template>
  <div class="chart-host" :style="hostStyle" data-testid="demo-chart-host">
    <div v-if="!compare" class="rrg-chart-wrap" :class="{ dark }">
      <RrgChart
        :class="{ dark }"
        :style="themeStyle"
        :region-id="chartRegionId ?? DEMO_CHART_REGION_ID"
        v-bind="singleProps"
        v-model:visible-tickers="visibleTickers"
        @point-hover="emit('pointHover', $event)"
        @point-leave="emit('pointLeave')"
      />
    </div>
    <div v-else class="compare" data-testid="demo-compare-host">
      <div class="rrg-chart-wrap" :class="{ dark }" data-testid="demo-compare-left">
        <p class="pane-label">{{ leftProps.viewportMode }}</p>
        <RrgChart
          :class="{ dark }"
          :style="themeStyle"
          v-bind="leftProps"
          v-model:visible-tickers="visibleTickers"
          @point-hover="emit('pointHover', $event)"
          @point-leave="emit('pointLeave')"
        />
      </div>
      <div class="rrg-chart-wrap" :class="{ dark }" data-testid="demo-compare-right">
        <p class="pane-label">{{ rightProps.viewportMode }}</p>
        <RrgChart
          :class="{ dark }"
          :style="themeStyle"
          v-bind="rightProps"
          v-model:visible-tickers="visibleTickers"
          @point-hover="emit('pointHover', $event)"
          @point-leave="emit('pointLeave')"
        />
      </div>
    </div>
  </div>
</template>
