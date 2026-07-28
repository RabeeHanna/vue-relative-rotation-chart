import { computed, type ComputedRef, type Ref } from 'vue'
import type { RrgRenderSeries } from '../types/rrg'
import type { ChartDateStatus } from '../utils/chartDate'
import { exportSvgElementAsPng } from '../utils/exportChartSvg'
import type { ExportChartPngOptions } from '../utils/exportChartSvg'

export function useRrgChartEmptyState(
  coloredSeries: ComputedRef<readonly RrgRenderSeries[]>,
  dateStatus: ComputedRef<ChartDateStatus>,
) {
  const allSeriesHidden = computed(
    () =>
      coloredSeries.value.length > 0 &&
      coloredSeries.value.every((item) => item.visible === false),
  )
  const isEmpty = computed(() => dateStatus.value === 'empty' || allSeriesHidden.value)
  const emptyReason = computed(() =>
    allSeriesHidden.value ? 'all-hidden' : 'no-dates',
  )
  const emptyMessage = computed(() =>
    allSeriesHidden.value ? 'All series are hidden' : 'No series dates to display',
  )

  return { isEmpty, emptyReason, emptyMessage }
}

export function useRrgChartExport(chartRoot: Ref<HTMLElement | null>) {
  function getSvgElement(): SVGSVGElement | null {
    return chartRoot.value?.querySelector('svg') ?? null
  }

  async function exportPng(options?: ExportChartPngOptions): Promise<string | null> {
    const svg = getSvgElement()
    if (!svg) return null
    return exportSvgElementAsPng(svg, options)
  }

  return { getSvgElement, exportPng }
}
