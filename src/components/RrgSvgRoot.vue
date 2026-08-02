<script setup lang="ts">
import { computed, useId } from 'vue'
import { RRG_DEFAULT_MARGIN, type RrgMargin } from '../utils/chartLayout'

const props = withDefaults(
  defineProps<{
    width: number
    height: number
    margin?: RrgMargin
    title?: string
    description?: string
  }>(),
  {
    margin: () => ({ ...RRG_DEFAULT_MARGIN }),
    title: 'Relative Rotation Chart',
    description: '',
  },
)

const uid = useId()
const titleId = computed(() => `${uid}-title`)
const descId = computed(() => `${uid}-desc`)

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
        <slot />
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
