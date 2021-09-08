import { SSE } from './SSE'
import Vue from 'vue'

class Plugin {
  public install () {
    const sse = new SSE('/.well-known/mercure', process.env.VUE_APP_SSE || window.origin)
    Object.defineProperties(Vue.prototype, {
      $sse: {
        get (): SSE {
          return sse
        }
      }
    })
  }
}

Vue.use(new Plugin())
