exports.config = {
  tests: './tests/codeceptjs/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://127.0.0.1:3000',
      show: true,
      browser: 'chromium'
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'codeceptjs',
  translation: 'ru-RU',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}
