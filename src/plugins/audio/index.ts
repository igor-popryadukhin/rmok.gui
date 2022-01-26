import AudioPlayer from './src/AudioPlayer'
import Vue from 'vue'

const audio = new AudioPlayer()

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $audio: {
        get (): AudioPlayer {
          return audio
        }
      }
    })

    Vue.observable(audio)
  }
})
