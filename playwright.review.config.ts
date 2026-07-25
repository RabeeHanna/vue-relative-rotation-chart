import base from './playwright.config'

export default {
  ...base,
  testIgnore: undefined,
  testMatch: /adversarial-screenshots\.spec\.ts/,
}
