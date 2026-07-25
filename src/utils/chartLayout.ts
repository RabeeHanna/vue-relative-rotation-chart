export type RrgMargin = {
  top: number
  right: number
  bottom: number
  left: number
}

export const RRG_DEFAULT_MARGIN: RrgMargin = {
  top: 24,
  right: 24,
  bottom: 44,
  left: 52,
}

export const RRG_CHART_INJECTION = {
  plotWidth: 'rrgPlotWidth',
  plotHeight: 'rrgPlotHeight',
  margin: 'rrgMargin',
} as const
