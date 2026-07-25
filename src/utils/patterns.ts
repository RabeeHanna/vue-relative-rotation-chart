export const RRG_PATTERN_KINDS = [
  'hatch-0',
  'hatch-45',
  'hatch-90',
  'dots',
  'cross',
] as const

export type RrgPatternKind = (typeof RRG_PATTERN_KINDS)[number]

/** Deterministic pattern kind by series index (same order as color assignment). */
export function patternKindForIndex(index: number): RrgPatternKind {
  return RRG_PATTERN_KINDS[index % RRG_PATTERN_KINDS.length]
}

/** Stable SVG pattern element id for a ticker. */
export function patternElementId(ticker: string): string {
  const safe = ticker.replace(/[^a-zA-Z0-9_-]/g, '-')
  return `rrg-pattern-${safe}`
}
