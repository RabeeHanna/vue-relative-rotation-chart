/** Domain/bounds helpers for viewport math. */

export function padExtent(min: number, max: number, padding: number): [number, number] {
  return [min - padding, max + padding]
}

export function roundDomainBound(
  value: number,
  step = 0.5,
  mode: 'floor' | 'ceil' = 'floor',
): number {
  return mode === 'ceil' ? Math.ceil(value / step) * step : Math.floor(value / step) * step
}
