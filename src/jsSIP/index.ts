import Vue from 'vue'
import { JsSIP } from '@/jsSIP/plugin'

/* eslint-disable */
const $jssip: JsSIP = new JsSIP(`wss://server:8089/ws`, {
  /* eslint-disable */
  uri: `sip:0000@server`,
  display_name: 'Test',
  password: 'password'
  /* eslint-enable */
})

class JsSIPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $jsSIP: {
        get (): JsSIP {
          return $jssip
        }
      }
    })

    Vue.observable($jssip)
  }
}

Vue.use(new JsSIPlugin())

/* eslint-enable */
