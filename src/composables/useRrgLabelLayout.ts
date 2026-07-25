import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgLabelMode, RrgRenderPoint } from '../types/rrg'
import type { RrgScale } from './useRrgScales'
import {
  computeSpatialBinLayout,
  type LabelLayoutOptions,
  type ResolvedLabel,
} from '../utils/labels'

type MaybeRef<T> = ComputedRef<T> | Ref<T>

/**
 * Spatial-bin label layout with labelMode / tickerLabelAlwaysVisible overrides.
 */
export function useRrgLabelLayout(
  currentPoints: MaybeRef<RrgRenderPoint[]>,
  labelMode: MaybeRef<RrgLabelMode>,
  xScale: MaybeRef<RrgScale>,
  yScale: MaybeRef<RrgScale>,
  options: LabelLayoutOptions & {
    tickerLabelAlwaysVisible?: MaybeRef<boolean> | boolean
  } = {},
): ComputedRef<ResolvedLabel[]> {
  return computed(() => {
    const alwaysVisible =
      typeof options.tickerLabelAlwaysVisible === 'boolean'
        ? options.tickerLabelAlwaysVisible
        : (options.tickerLabelAlwaysVisible?.value ?? false)

    const pixelPoints = currentPoints.value.map((p) => ({
      ticker: p.ticker,
      label: p.label,
      px: xScale.value(p.x),
      py: yScale.value(p.y),
    }))

    const layout = computeSpatialBinLayout(pixelPoints, options)
    const mode = labelMode.value

    return layout.map((label) => {
      if (alwaysVisible || mode === 'always') {
        return { ...label, visible: true }
      }
      if (mode === 'hover') {
        return { ...label, visible: false }
      }
      return label
    })
  })
}

export type { ResolvedLabel }
