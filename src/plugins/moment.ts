import Vue from 'vue'
import moment from 'moment'

// todo: реализовать возможность изменять локаль
moment.locale('ru')

class PermissionPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $moment: {
        get () {
          return moment
        }
      }
    })
  }
}

Vue.use(new PermissionPlugin())

export const $moment = moment
