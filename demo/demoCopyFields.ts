import type { RrgChartCopy, RrgPlaybackCopy } from '../src/types/copy'

/** Empty string = use package default. */
export type DemoChartCopyFields = Record<keyof RrgChartCopy, string>
export type DemoPlaybackCopyFields = Record<keyof RrgPlaybackCopy, string>

export const EMPTY_CHART_COPY: DemoChartCopyFields = {
  leading: '',
  weakening: '',
  lagging: '',
  improving: '',
  rsRatio: '',
  rsMomentum: '',
  quadrant: '',
  chartTitle: '',
  chartDescription: '',
  emptyAllHidden: '',
  emptyNoDates: '',
  axisTitleX: '',
  axisTitleY: '',
}

export const EMPTY_PLAYBACK_COPY: DemoPlaybackCopyFields = {
  play: '',
  pause: '',
  stepBackward: '',
  stepForward: '',
  timeline: '',
  decreaseSpeed: '',
  increaseSpeed: '',
  loop: '',
  frame: '',
  group: '',
}

export function partialCopyFromFields<T extends Record<string, string>>(
  fields: T,
): Partial<T> {
  const out: Partial<T> = {}
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.trim() !== '') {
      ;(out as Record<string, string>)[key] = value
    }
  }
  return out
}
