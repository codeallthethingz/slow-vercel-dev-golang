const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
  defaultCommandTimeout: 20000,
  // turn off video recording
  video: false,
})
