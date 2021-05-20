<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="showing"
      :max-width="breakpointWidth"
      hide-overlay
      no-click-animation
      persistent
    >
      <v-card tile>
        <v-progress-linear
          v-model="progress"
          class="my-0"
          height="8"
          style="cursor: pointer"
          tabindex="0"
          @click.native="onProgressClick(progress)"
        ></v-progress-linear>

        <v-list>
          <v-list-item>
            <v-list-item-content style="overflow: initial!important;">
              <v-list-item-title>{{ author }}</v-list-item-title>
              <v-list-item-subtitle>{{ durationHms }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer />

            <!-- Actions -->
            <!-- Скачать -->
            <v-list-item-icon class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!src"
                    :href="src"
                    target="_blank"
                    icon
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <span>{{ tc('Download the audio file to your computer') }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <!-- Скачать -->

            <v-list-item-action class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <template>
                    <v-slider
                      v-model="audioPlayerVolume"
                      v-bind="attrs"
                      v-on="on"
                      :max="1"
                      :min="0"
                      :step="0.01"
                      style="min-width: 150px"
                      prepend-icon="mdi-volume-high"
                    ></v-slider>
                  </template>
                </template>
                <span>{{ tc('Audio file playback speed') }}</span>
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-icon class="mr-5">
              <v-tooltip
                open-delay="500"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="onSpeedClick"
                  >
                    <v-icon>{{ stateSpeedIcon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ tc('Audio file playback speed') }}</span>
              </v-tooltip>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                icon
                @click="backward"
              >
                <v-icon>mdi-skip-backward</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn
                v-if="paused"
                icon
                @click="play"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                @click="pause"
              >
                <v-icon>mdi-pause</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon>
              <v-btn
                icon
                @click="close"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-icon>
            <!-- Actions -->

          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">

import { debounce } from 'vuetify/src/util/helpers'
import secondsToHmsDigital from './secondsToHmsDigital'
import { makeAudioElement } from './utils'
import Vue from 'vue'

interface IData {
  src: string;
  stateSpeed: 'x1' | 'x2' | 'x3',
  stateSpeedIcon: string;
  audioPlayer: HTMLAudioElement;
  author: string;
  audioPlayerVolume: number;
  showing: boolean;
  progress: number;
  duration: number;
  paused: boolean;
  playbackRate: number;
  volumeChange: (value: number) => void
}

interface IMethods {
  [key: string]: any;
}

interface IComputed {
  breakpointWidth: string;
  [key: string]: any;
}

interface IProps{
  autoCloseAfterEndPlay: boolean;
  audioElementInstance?: HTMLAudioElement;
  [key: string]: any;
}

export default Vue.extend<IData, IMethods, IComputed, IProps>({
  name: 'AppAudioPlayer',

  props: {
    autoCloseAfterEndPlay: {
      type: Boolean,
      default: () => false
    },

    volume: {
      type: Number,
      default: () => 1
    },

    audioElementInstance: {
      type: HTMLAudioElement,
      required: true,
      validator: function (value: unknown) {
        return value instanceof HTMLAudioElement
      }
    }
  },

  data (): IData {
    return {
      src: '',
      stateSpeed: 'x1',
      stateSpeedIcon: 'mdi-numeric-1-circle-outline',
      audioPlayer: makeAudioElement(),
      author: '',
      showing: false,
      audioPlayerVolume: 1,
      progress: 0,
      duration: 0,
      paused: true,
      playbackRate: 1.0,
      volumeChange: debounce((value: number) => {
        this.$emit('update:volume', value)
      }, 250)
    }
  },

  watch: {
    // Внешнее изменение громкости
    volume (value: number) {
      this.audioPlayerVolume = value
    },

    // Внутреннее изменение громкости
    audioPlayerVolume (value: number) {
      this.audioPlayer.volume = value
      this.volumeChange(value)
    }
  },

  computed: {
    durationHms () {
      return secondsToHmsDigital(this.duration)
    },

    breakpointWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
          return '100%'
        case 'md':
          return '70%'
        case 'lg':
          return '60%'
        case 'xl':
          return '50%'

        default: return '100%'
      }
    },

    isShowing () {
      return this.showing
    }
  },

  created () {
    this.audioPlayerVolume = this.volume
  },

  mounted () {
    this.initializePlayer()
  },

  methods: {
    tc (name: string) {
      return this?.$tc(name) || name
    },

    backward () {
      this.audioPlayer.currentTime = 0.0
    },

    play (options?: { src?: string; author?: string }) {
      this.setSpeedNormal()

      if (options?.src) {
        this.src = options.src
        this.audioPlayer.src = options.src
      }

      if (options?.author) {
        this.author = options?.author
      }

      this.paused = false
      this.audioPlayer.play()
    },

    pause () {
      this.paused = true
      this.audioPlayer.pause()
    },

    stop () {
      this.audioPlayer.pause()
      this.progress = 0.0
      this.audioPlayer.currentTime = 0.0
      this.paused = this.audioPlayer.paused
    },

    show () {
      this.showing = true
    },

    hide () {
      this.showing = false
    },

    close () {
      this.stop()
      this.hide()
    },

    setMediaData (options: unknown & { author: string; src: string }) {
      this.stop()
      this.author = options?.author || ''
      this.src = options?.src || ''
      this.audioPlayer.src = options?.src || ''
    },

    /**
     * При клике установить позицию
     * @param progress
     */
    onProgressClick (progress: number) {
      this.audioPlayer.currentTime = (progress * this.audioPlayer.duration) / 100
    },

    onSpeedClick () {
      switch (this.stateSpeed) {
        case 'x1': {
          this.audioPlayer.playbackRate = 1.5
          this.stateSpeed = 'x2'
          this.stateSpeedIcon = 'mdi-numeric-2-circle-outline'
          break
        }

        case 'x2': {
          this.audioPlayer.playbackRate = 2.0
          this.stateSpeed = 'x3'
          this.stateSpeedIcon = 'mdi-numeric-3-circle-outline'
          break
        }

        case 'x3': {
          this.audioPlayer.playbackRate = 1.0
          this.stateSpeed = 'x1'
          this.stateSpeedIcon = 'mdi-numeric-1-circle-outline'
          break
        }
      }
    },

    setSpeedNormal () {
      this.audioPlayer.playbackRate = 1.0
      this.stateSpeed = 'x1'
      this.stateSpeedIcon = 'mdi-numeric-1-circle-outline'
    },

    initializePlayer () {
      this.audioPlayer = this.audioElementInstance as HTMLAudioElement
      this.audioPlayer.currentTime = 0.0
      this.audioPlayer.src = ''
      this.audioPlayer.loop = false
      this.audioPlayer.volume = this.audioPlayerVolume

      // Прогресс
      this.audioPlayer.ontimeupdate = () => {
        this.progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100
      }

      // Начало
      this.audioPlayer.onplay = () => {
        this.duration = this.audioPlayer.duration
      }

      // Конец
      this.audioPlayer.onended = () => {
        this.paused = this.audioPlayer.paused
        this.audioPlayer.currentTime = 0.0
        this.progress = 0

        if (this.autoCloseAfterEndPlay) {
          setTimeout(() => {
            this.showing = false
          }, 1500)
        }
      }
    }
  }
})
</script>

<style scoped>

</style>
