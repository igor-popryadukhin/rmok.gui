import Vue from 'vue'
import parsePhoneNumber from 'libphonenumber-js'

class LibphonenumberJsPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $parsePhoneNumber: {
        get () {
          return parsePhoneNumber
        }
      }
    })
  }
}

Vue.use(new LibphonenumberJsPlugin())
