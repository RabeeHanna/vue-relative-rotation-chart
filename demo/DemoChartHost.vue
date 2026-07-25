<script setup lang="ts">
import { RrgChart, type RrgChartProps, type RrgRenderPoint } from '../src'

defineProps<{
  compare: boolean
  leftProps: RrgChartProps
  rightProps: RrgChartProps
  singleProps: RrgChartProps
  dark: boolean
  hostStyle?: Record<string, string>
}>()

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
        v-bind="singleProps"
        @point-hover="emit('pointHover', $event)"
        @point-leave="emit('pointLeave')"
      />
    </div>
    <div v-else class="compare" data-testid="demo-compare-host">
      <div class="rrg-chart-wrap" :class="{ dark }" data-testid="demo-compare-left">
        <p class="pane-label">{{ leftProps.viewportMode }}</p>
        <RrgChart
          :class="{ dark }"
          v-bind="leftProps"
          @point-hover="emit('pointHover', $event)"
          @point-leave="emit('pointLeave')"
        />
      </div>
      <div class="rrg-chart-wrap" :class="{ dark }" data-testid="demo-compare-right">
        <p class="pane-label">{{ rightProps.viewportMode }}</p>
        <RrgChart
          :class="{ dark }"
          v-bind="rightProps"
          @point-hover="emit('pointHover', $event)"
          @point-leave="emit('pointLeave')"
        />
      </div>
    </div>
  </div>
</template>
