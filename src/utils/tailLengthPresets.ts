import { RRG_TAIL_LENGTH_PRESETS } from '../types/defaults'

/** Preset list with the current tail length included for select matching. */
export function resolveTailLengthPresets(
  current: number,
  presets: readonly number[] = RRG_TAIL_LENGTH_PRESETS,
): number[] {
  const value = Math.max(1, Math.floor(current))
  const merged = new Set(presets)
  merged.add(value)
  return [...merged].sort((a, b) => a - b)
}
