import Vue from 'vue'

function generateUUID () {
  let d = new Date().getTime()
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0// Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16// random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else { // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function makeAudioElement (id?: string): HTMLAudioElement {
  const audioElement: HTMLAudioElement = document.createElement('audio')
  if (id) {
    audioElement.setAttribute('id', id)
  }
  audioElement.setAttribute('style', 'display: none')
  audioElement.setAttribute('controls', '')
  return audioElement
}

function removeAudioElement (id: string) {
  const element: HTMLElement | null = document.getElementById(id)
  if (element) {
    element.remove()
  }
}

const audioPlayerId = generateUUID()

const audioPlayer = Vue.extend({
  data () {
    return {
      audioPlayer: {
        audioElement: makeAudioElement(audioPlayerId)
      }
    }
  },

  destroyed () {
    removeAudioElement(audioPlayerId)
  },

  methods: {
    playSound (src: string, loop = false, options = { onEnded: null, onProgressUpdate: null }): void {
      if ('onEnded' in options) {
        if (typeof options.onEnded === 'function') {
          this.audioPlayer.audioElement.onended = options.onEnded
        } else {
          throw Error('This is not a function!')
        }
      }

      if ('onProgressUpdate' in options) {
        if (typeof options.onProgressUpdate === 'function') {
          const onProgressUpdate = options.onProgressUpdate
          this.audioPlayer.audioElement.ontimeupdate = () => {
            const duration = this.audioPlayer.audioElement.duration
            if (duration > 0) {
              (onProgressUpdate as any)((this.audioPlayer.audioElement.currentTime / duration) * 100)
            }
          }
        } else {
          throw Error('This is not a function!')
        }
      }

      if (!this.audioPlayer.audioElement.paused) {
        this.audioPlayer.audioElement.pause()
      }
      this.audioPlayer.audioElement.currentTime = 0.0
      this.audioPlayer.audioElement.src = src
      this.audioPlayer.audioElement.loop = loop
      this.audioPlayer.audioElement.play()
    },

    stopSound () {
      this.audioPlayer.audioElement.pause()
      this.audioPlayer.audioElement.currentTime = 0.0
    }
  }
})

export default audioPlayer
