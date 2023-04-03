import { defineStore } from 'pinia'

export const useConfigStore = () => {
  const innerStore = defineStore('ConfigStore', {
    state: () => {
      return {
        environment: 'initializing',
        stripePublicKey: '',
        message: '',
        messageType: '',
        timeoutId: 0,
        screenSizeBigEnough: true,
        updates: [],
      }
    },
    actions: {
      getEnvironment() {
        return this.environment
      },
      isDevelopment() {
        return this.environment === 'development'
      },
      isPreview() {
        return this.environment === 'preview'
      },
      isProduction() {
        return this.environment === 'production' || this.environment === 'initializing'
      },
      async initialize() {
        this.fetchingEnvironment = true
        try {
          const response = await fetch('api/environment')
          if (response.status !== 200) {
            return 'initializing'
          }
          this.environment = await response.text()

          const responseKey = await fetch('api/stripe/public-key')
          this.stripePublicKey = await responseKey.text()

          const responseUpdates = await fetch('api/updates')
          this.updates = await responseUpdates.json()
        } finally {
          this.fetchingEnvironment = false
        }
      },
      incompatibleScreenSize(screenSizeBigEnough) {
        this.screenSizeBigEnough = screenSizeBigEnough
      },
      info(message) {
        this.message = message
        this.messageType = 'info'
        this.fadeInFive()
      },
      error(message) {
        this.message = message
        this.messageType = 'danger'
        this.fadeInFive()
      },
      clearMessage() {
        if (this.timeoutId !== 0) {
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        }
        this.message = ''
      },
      fadeInFive() {
        if (this.timeoutId !== 0) {
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        }
        this.timeoutId = setTimeout(() => {
          this.message = ''
          this.timeoutId = 0
        }, 5000)
      },
    },
    persist: {
      enabled: false,
      strategies: [
        {
          storage: localStorage,
        },
      ],
    },
  })
  let s = innerStore()
  if (s.environment === 'initializing' && !s.fetchingEnvironment) {
    s.initialize()
  }
  return s
}
