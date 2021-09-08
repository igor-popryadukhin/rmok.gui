import Vue from 'vue'

import debug, { Debugger } from 'debug'

class Plugin {
  public install () {
    const appDebug = debug('APP')
    Object.defineProperties(Vue.prototype, {
      $appDebug: {
        get (): Debugger {
          return appDebug
        }
      }
    })
  }
}

Vue.use(new Plugin())
