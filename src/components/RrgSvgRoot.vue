<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'
import { RRG_DEFAULT_MARGIN, type RrgMargin } from '../utils/chartLayout'

const props = withDefaults(
  defineProps<{
    width: number
    height: number
    margin?: RrgMargin
    plotWidth?: number
    plotHeight?: number
    title?: string
    description?: string
  }>(),
  {
    margin: () => ({ ...RRG_DEFAULT_MARGIN }),
    title: 'Relative Rotation Chart',
    description: '',
  },
)

const slots = useSlots()
const uid = useId()
const titleId = computed(() => `${uid}-title`)
const descId = computed(() => `${uid}-desc`)
const clipPathId = computed(() => `${uid}-plot-clip`)
const clipPathRef = computed(() => `url(#${clipPathId.value})`)
const hasSeriesSlot = computed(() => !!slots.series)
const resolvedPlotWidth = computed(
  () => props.plotWidth ?? Math.max(0, props.width - props.margin.left - props.margin.right),
)
const resolvedPlotHeight = computed(
  () => props.plotHeight ?? Math.max(0, props.height - props.margin.top - props.margin.bottom),
)

defineExpose({
  svgWidth: computed(() => props.width),
  svgHeight: computed(() => props.height),
  titleId,
  descId,
})
</script>

<template>
  <div class="rrg-svg-host" data-testid="rrg-svg-host">
    <svg
      class="rrg-svg-root"
      data-testid="rrg-svg-root"
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-labelledby="titleId"
      :aria-describedby="descId"
    >
      <title :id="titleId">{{ title }}</title>
      <desc :id="descId">{{ description }}</desc>
      <rect
        class="rrg-bg"
        x="0"
        y="0"
        :width="width"
        :height="height"
        fill="var(--rrg-bg, #ffffff)"
      />
      <g
        class="rrg-plot"
        data-testid="rrg-plot"
        :transform="`translate(${margin.left}, ${margin.top})`"
      >
        <defs>
          <clipPath :id="clipPathId" data-testid="rrg-plot-clip-path">
            <rect
              class="rrg-plot-clip-rect"
              data-testid="rrg-plot-clip-rect"
              x="0"
              y="0"
              :width="resolvedPlotWidth"
              :height="resolvedPlotHeight"
            />
          </clipPath>
        </defs>
        <slot />
        <g
          v-if="hasSeriesSlot"
          class="rrg-plot-series"
          data-testid="rrg-plot-series"
          :clip-path="clipPathRef"
        >
          <slot name="series" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.rrg-svg-host {
  width: 100%;
  min-height: 320px;
  display: block;
}

.rrg-svg-root {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
