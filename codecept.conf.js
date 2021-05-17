exports.config = {
  bootstrap: null,
  helpers: {
    Playwright: {
      browser: 'chromium',
      show: true,
      url: 'http://127.0.0.1:3000'
    }
  },
  include: {
    I: './steps_file.js'
  },
  mocha: {},
  name: 'codeceptjs',
  output: './output',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    tryTo: {
      enabled: true
    }
  },
  tests: './tests/codeceptjs/*_test.js',
  translation: 'ru-RU'
}
