import type { RrgChartFormatters } from '../types/rrg'

export type ResolvedRrgChartFormatters = Required<RrgChartFormatters>

export const RRG_CHART_FORMATTER_DEFAULTS: ResolvedRrgChartFormatters = {
  formatNumber: (value: number) => value.toFixed(2),
  formatAxisTick: (value: number) => String(value),
}

export function resolveChartFormatters(
  partial?: RrgChartFormatters | null,
): ResolvedRrgChartFormatters {
  return {
    formatNumber: partial?.formatNumber ?? RRG_CHART_FORMATTER_DEFAULTS.formatNumber,
    formatAxisTick: partial?.formatAxisTick ?? RRG_CHART_FORMATTER_DEFAULTS.formatAxisTick,
  }
}
