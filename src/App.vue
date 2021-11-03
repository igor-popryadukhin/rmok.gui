<template>
  <div>
    <div class="text-center">
      <v-overlay
        v-if="overlay"
        z-index="150"
        :value="overlay"
      >
        <div class="d-flex align-center">
          <v-progress-circular
            indeterminate
            size="64"
          />
          <div style="margin-top: 16px">
            {{ $tc('Loading...') }}
          </div>
        </div>
      </v-overlay>
    </div>
    <component
      :is="layout"
      :key="2"
      tabindex="-1"
    />

    <!-- AUDIO PLAYER -->
    <app-audio-player
      ref="audioPlayer"
      :audio-element-instance="$htmlAudioElement"
      :volume.sync="audioPlayerVolume"
      auto-close-after-end-play
    />
    <!-- AUDIO PLAYER -->

    <!-- FOR DEVELOPMENT -->
    <div
      v-if="screenDevVisible"
      class="text-grey-5"
      style="left: 100px; bottom: 30px; display: block; position: absolute; z-index: 5000; font-size: 13px; pointer-events: none;"
    >
      <div
        class="for-dev-info"
      />
    </div>
    <!-- FOR DEVELOPMENT -->
  </div>
</template>

<script lang="ts">
import AppAudioPlayer from '@/components/AppAudioPlayer/AppAudioPlayer.vue'
import { ProfileState } from '@/store/profile/state'
import Vue from 'vue'
import { VApp } from 'vuetify/lib'
import { POSITION } from 'vue-toastification'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({

  name: 'App',

  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'foo' }
    ]
  },

  components: {
    AppAudioPlayer,
    VApp
  },

  data () {
    return {
      RTCToastOptions: {
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        draggablePercent: 0.47,
        hideProgressBar: false,
        icon: false,
        id: '',
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        position: POSITION.TOP_RIGHT,
        rtl: false,
        timeout: false,
        toastClassName: 'incoming-rtc-toast'
      } as ToastOptions,
      contactStatusDialog: {
        historyId: 0,
        visible: false
      },
      organization: {} as ContactInterface,
      overlay: false,
      screenDevVisible: false,
      toastId: 0 as number | string
    }
  },

  computed: {
    layout () {
      return this.$route.meta.layout || 'clean'
    },

    audioPlayerVolume: {
      get () {
        return this.$store.getters['settings/audio_player_volume']
      },

      set (value: number) {
        this.$store.commit('settings/audio_player_volume', value)
      }
    },

    // ...mapGetters({
    //   profile: 'profile/profile',
    //   profile_tz: 'profile/tz' // Текущая временная зона.
    // })

    profile (): ProfileState {
      return this.$store.getters['profile/profile']
    }
  },

  mounted () {
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$on('on-audio-player-show', this.onAudioPlayerShow)

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  },

  destroyed () {
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$off('on-audio-player-show', this.onAudioPlayerShow)

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {

    onKeyDown (e: KeyboardEvent) {
      if (e.code === 'ControlLeft') {
        this.screenDevVisible = true
      }
    },

    onKeyUp (e: KeyboardEvent) {
      if (e.code === 'ControlLeft') {
        this.screenDevVisible = false
      }
    },

    onMousemove (e: MouseEvent) {
      this.$appDebug(e)
    },

    rootLoadingDataHide () {
      this.overlay = false
    },

    rootLoadingDataShow () {
      this.overlay = true
    },

    onAudioPlayerShow ({ src, author }: unknown & { src: string; author: string }) {
      this.$refs.audioPlayer.setMediaData({
        src,
        author
      })

      setTimeout(() => {
        this.$refs.audioPlayer.show()
        this.$refs.audioPlayer.play()
      }, 500)
    }
  }
})
</script>

<style lang="scss">

//.v-overlay {
//  backdrop-filter: blur(1px);
//}
//
//.v-overlay__scrim {
//  backdrop-filter: blur(1px);
//}

.is-dev {
  padding: 10px;
}
</style>
