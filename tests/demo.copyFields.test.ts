import { describe, expect, it } from 'vitest'
import {
  EMPTY_CHART_COPY,
  EMPTY_PLAYBACK_COPY,
  partialCopyFromFields,
} from '../demo/demoCopyFields'

describe('demo copy fields', () => {
  it('omits blank strings from partial copy', () => {
    expect(
      partialCopyFromFields({
        ...EMPTY_CHART_COPY,
        leading: 'Lider',
        weakening: '  ',
        rsRatio: 'Ratio',
      }),
    ).toEqual({ leading: 'Lider', rsRatio: 'Ratio' })
  })

  it('returns empty object when all playback fields are blank', () => {
    expect(partialCopyFromFields(EMPTY_PLAYBACK_COPY)).toEqual({})
  })
})
