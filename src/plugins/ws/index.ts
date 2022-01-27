import Ws from './src/Ws'
import Vue from 'vue'

const ws = new Ws()

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $ws: {
        get (): Ws {
          return ws
        }
      }
    })

    Vue.observable(ws)
  }
})
