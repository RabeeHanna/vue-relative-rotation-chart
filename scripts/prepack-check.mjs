import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')

if (process.env.npm_config_dry_run === 'true') {
  process.exit(0)
}

const required = [
  'index.d.ts',
  'vue-relative-rotation-chart.js',
  'vue-relative-rotation-chart.cjs',
  'vue-relative-rotation-chart.css',
  'scenarios.js',
  'scenarios/index.d.ts',
]

if (!existsSync(dist)) {
  console.error('prepublishOnly: dist/ missing — run npm run build before npm publish')
  process.exit(1)
}

const missing = required.filter((rel) => !existsSync(join(dist, rel)))
if (missing.length) {
  console.error('prepublishOnly: dist/ is incomplete. Missing:', missing.join(', '))
  process.exit(1)
}
