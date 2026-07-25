import { describe, expect, it } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { useRrgScales } from '../src/composables/useRrgScales'
import type { RrgDomain } from '../src/types/rrg'

describe('useRrgScales', () => {
  it('maps x domain min/max to plot width range', () => {
    const domain = computed<RrgDomain>(() => ({
      xMin: 90,
      xMax: 110,
      yMin: 90,
      yMax: 110,
    }))
    const { xScale } = useRrgScales(domain, computed(() => 200), computed(() => 100))
    expect(xScale.value(90)).toBe(0)
    expect(xScale.value(110)).toBe(200)
    expect(xScale.value(100)).toBe(100)
  })

  it('maps y domain with inverted SVG range', () => {
    const domain = computed<RrgDomain>(() => ({
      xMin: 90,
      xMax: 110,
      yMin: 90,
      yMax: 110,
    }))
    const { yScale } = useRrgScales(domain, computed(() => 200), computed(() => 100))
    expect(yScale.value(90)).toBe(100)
    expect(yScale.value(110)).toBe(0)
  })

  it('updates reactively when domain changes', async () => {
    const domainRef = ref<RrgDomain>({
      xMin: 90,
      xMax: 110,
      yMin: 90,
      yMax: 110,
    })
    const domain = computed(() => domainRef.value)
    const { xScale } = useRrgScales(domain, computed(() => 100), computed(() => 100))
    expect(xScale.value(100)).toBe(50)

    domainRef.value = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 }
    await nextTick()
    expect(xScale.value(100)).toBe(100)
  })
})
