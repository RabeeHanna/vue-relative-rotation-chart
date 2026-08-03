const pkg = require('vue-relative-rotation-chart')

if (!pkg.RrgChart) {
  throw new Error('RrgChart export missing from CJS build')
}
if (typeof pkg.collectSeriesDates !== 'function') {
  throw new Error('collectSeriesDates export missing from CJS build')
}
if (pkg.RrgChart.render == null && pkg.RrgChart.__vccOpts == null && typeof pkg.RrgChart !== 'object') {
  throw new Error('RrgChart does not look like a Vue component export')
}

console.log('cjs smoke ok')
