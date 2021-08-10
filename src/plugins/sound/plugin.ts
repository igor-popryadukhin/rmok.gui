import Vue from 'vue'
import Sound from './Sound'

class Plugin {
  public install () {
    const sound = new Sound()
    Object.defineProperties(Vue.prototype, {
      $sound: {
        get (): Sound {
          return sound
        }
      }
    })
  }
}

Vue.use(new Plugin())
