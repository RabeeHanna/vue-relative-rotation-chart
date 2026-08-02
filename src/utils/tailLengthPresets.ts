import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'

/**
 * Tail-length select options: deduplicated, sorted numerically.
 * Inserts the exact current value when finite and not already present.
 */
export function resolveTailLengthPresets(
  current: number,
  presets: readonly number[] = RRG_TAIL_LENGTH_PRESETS,
): number[] {
  const values = [...new Set(presets)]

  if (Number.isFinite(current) && !values.includes(current)) {
    values.push(current)
  }

  return values.sort((a, b) => a - b)
}
