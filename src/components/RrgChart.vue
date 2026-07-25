<script setup lang="ts">
import { RRG_CHART_DEFAULTS, type RrgChartProps } from '../types/rrg'

withDefaults(defineProps<RrgChartProps>(), {
  tailLength: RRG_CHART_DEFAULTS.tailLength,
  viewportMode: RRG_CHART_DEFAULTS.viewportMode,
  labelMode: RRG_CHART_DEFAULTS.labelMode,
  showQuadrantLabels: RRG_CHART_DEFAULTS.showQuadrantLabels,
  showGrid: RRG_CHART_DEFAULTS.showGrid,
  showAxes: RRG_CHART_DEFAULTS.showAxes,
  showPatterns: RRG_CHART_DEFAULTS.showPatterns,
  tickerLabelAlwaysVisible: RRG_CHART_DEFAULTS.tickerLabelAlwaysVisible,
  highlightedTicker: null,
  selectedTicker: null,
})

defineEmits<{
  pointHover: [point: import('../types/rrg').RrgRenderPoint]
  pointLeave: []
  pointClick: [point: import('../types/rrg').RrgRenderPoint]
}>()
</script>

<template>
  <div
    class="rrg-chart"
    data-testid="rrg-chart"
    :data-viewport-mode="viewportMode"
    :data-selected-date="selectedDate"
    :data-show-patterns="showPatterns ? 'true' : 'false'"
    :data-ticker-label-always-visible="tickerLabelAlwaysVisible ? 'true' : 'false'"
  >
    RRG Chart
  </div>
</template>

<style scoped>
.rrg-chart {
  color: var(--rrg-label, #222);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 1rem;
  border: 1px dashed var(--rrg-grid, #ccc);
}
</style>
