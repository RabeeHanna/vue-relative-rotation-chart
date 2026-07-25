export type TooltipPositionInput = {
  pointX: number
  pointY: number
  tooltipWidth: number
  tooltipHeight: number
  plotWidth: number
  plotHeight: number
  gap?: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Places a tooltip near a point while keeping it inside the plot bounds.
 * Prefer right of the point; flip left in the right half; flip below near the top.
 */
export function computeTooltipPosition(input: TooltipPositionInput): {
  x: number
  y: number
} {
  const gap = input.gap ?? 8
  const { pointX, pointY, tooltipWidth, tooltipHeight, plotWidth, plotHeight } =
    input

  let x =
    pointX > plotWidth / 2
      ? pointX - tooltipWidth - gap
      : pointX + gap

  let y =
    pointY < plotHeight * 0.25
      ? pointY + gap
      : pointY - tooltipHeight - gap

  const maxX = Math.max(0, plotWidth - tooltipWidth)
  const maxY = Math.max(0, plotHeight - tooltipHeight)
  x = clamp(x, 0, maxX)
  y = clamp(y, 0, maxY)

  return { x, y }
}
