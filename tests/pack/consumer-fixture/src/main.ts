import { createApp } from 'vue'
import { RrgChart } from 'vue-relative-rotation-chart'
import { scenarioFixtures } from 'vue-relative-rotation-chart/scenarios'
import 'vue-relative-rotation-chart/style.css'

const series = scenarioFixtures.default
const lastPoint = series[0]?.points[series[0].points.length - 1]
const selectedDate = lastPoint?.date ?? ''

createApp({
  components: { RrgChart },
  template: `<RrgChart :series="series" :selected-date="selectedDate" />`,
  data: () => ({ series, selectedDate }),
}).mount('#app')
