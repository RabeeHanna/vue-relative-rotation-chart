import { computed, type ComputedRef } from 'vue'
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import type { RrgDomain } from '../types/rrg'

export type RrgScale = ScaleLinear<number, number, never>

/**
 * D3 linear scales as pure math — never used for DOM mutation.
 */
export function useRrgScales(
  domain: ComputedRef<RrgDomain>,
  plotWidth: ComputedRef<number>,
  plotHeight: ComputedRef<number>,
): {
  xScale: ComputedRef<RrgScale>
  yScale: ComputedRef<RrgScale>
} {
  const xScale = computed(() =>
    scaleLinear()
      .domain([domain.value.xMin, domain.value.xMax])
      .range([0, Math.max(0, plotWidth.value)]),
  )

  const yScale = computed(() =>
    scaleLinear()
      .domain([domain.value.yMin, domain.value.yMax])
      .range([Math.max(0, plotHeight.value), 0]),
  )

  return { xScale, yScale }
}
