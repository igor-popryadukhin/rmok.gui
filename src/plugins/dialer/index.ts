import Vue from 'vue'
import Dialer from '@/plugins/dialer/Dialer'

const dialer = new Dialer()
// const dialer = new Dialer('wss://callcenter-1.ast.prod.rk-env.ru:443/ws', {
//   password: 'd8593e83002fe7bd225bd7648977a1da',
//   realm: 'callcenter-1.ast.prod.rk-env.ru',
//   uri: 'sip:1100@callcenter-1.ast.prod.rk-env.ru'
// })

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $dialer: {
        get (): Dialer {
          return dialer
        }
      }
    })

    Vue.observable(dialer)
  }
})
