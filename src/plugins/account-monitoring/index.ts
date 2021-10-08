import Vue from 'vue'
import AccountMonitoring from './AccountMonitoring'

const accountMonitoring = new AccountMonitoring()

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $accountMonitoring: {
        get (): AccountMonitoring {
          return accountMonitoring
        }
      }
    })

    Vue.observable(accountMonitoring)
  }
})

export const $accountMonitoring = accountMonitoring
