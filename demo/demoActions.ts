import type { Ref } from 'vue'
import type { RrgRenderSeries } from '../src/types/rrg'
import type { DemoControlsState } from './demoControlsState'
import { generateSeries, seriesJsonByteHint } from './generateSeries'
import { parseSeriesJson } from './parseSeriesJson'

export async function copyDemoText(
  text: string,
  ok: string,
  copyStatus: Ref<string>,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = ok
  } catch {
    copyStatus.value = 'Clipboard unavailable'
  }
}

export function applyDemoJson(
  controls: DemoControlsState,
  overrideSeries: Ref<RrgRenderSeries[] | null>,
): void {
  const result = parseSeriesJson(controls.jsonText)
  if (!result.ok) {
    controls.jsonError = result.error
    return
  }
  controls.jsonError = ''
  overrideSeries.value = result.series
  controls.source = 'custom'
}

export function generateDemoSeries(
  controls: DemoControlsState,
  overrideSeries: Ref<RrgRenderSeries[] | null>,
): void {
  const generated = generateSeries({
    tickerCount: controls.genTickers,
    pointsPerTicker: controls.genPoints,
    seed: controls.genSeed,
  })
  overrideSeries.value = generated
  controls.source = 'generated'
  controls.dataHint = seriesJsonByteHint(generated)
  controls.jsonError = ''
}
