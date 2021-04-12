<template>
  <div>
    <div class="text-center">
      <v-overlay v-if="overlay" z-index="150" :value="overlay">
        <div class="d-flex align-center">
          <v-progress-circular
            indeterminate
            size="64"
          ></v-progress-circular>
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
      @keydown.ctrl="$root.$emit('on-keydown-ctrl')"
      @keyup.ctrl="$root.$emit('on-keyup-ctrl')"
    />
    <!-- FOR DEVELOPMENT -->
    <div
      v-if="screenDevVisible"
      class="text-grey-5"
      style="left: 100px; bottom: 30px; display: block; position: absolute; z-index: 5000; font-size: 13px; pointer-events: none;"
    >
      <div
        class="for-dev-info"
      >
        <span>screen.width: {{ $vuetify.application.routes }}</span><br>
      </div>
    </div>
    <!-- FOR DEVELOPMENT -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VApp } from 'vuetify/lib'
import { POSITION } from 'vue-toastification'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({
  name: 'App',

  components: {
    VApp
  },

  data () {
    return {
      screenDevVisible: false,
      contactStatusDialog: {
        visible: false,
        historyId: 0
      },
      overlay: false,
      toastId: 0 as number | string,
      organization: {} as ContactInterface,
      RTCToastOptions: {
        id: '',
        position: POSITION.TOP_RIGHT,
        timeout: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        draggablePercent: 0.47,
        hideProgressBar: false,
        toastClassName: 'incoming-rtc-toast',
        closeOnClick: false,
        closeButton: false,
        icon: false,
        rtl: false
      } as ToastOptions
    }
  },

  computed: {
    layout () {
      return this.$route.meta.layout || 'clean'
    }
  },

  beforeCreate () {
    this.$store.dispatch('profile/loadProfile')
      .finally(() => {
        this.$root.$emit('root-jssip-initialize')
      })
    this.$store.dispatch('project/load')
  },

  mounted () {
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$on('on-keydown-ctrl', this.onKeyDown)
    this.$root.$on('on-keyup-ctrl', this.onKeyUp)
  },

  beforeDestroy () {
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$off('on-keydown-ctrl', this.onKeyDown)
    this.$root.$off('on-keyup-ctrl', this.onKeyUp)
  },

  methods: {

    rootLoadingDataShow () {
      this.overlay = true
    },

    rootLoadingDataHide () {
      this.overlay = false
    },

    onKeyDown (e: KeyboardEvent) {
      if (e.code === 'ControlLeft') {
        this.screenDevVisible = true
      }
    },

    onKeyUp (e: KeyboardEvent) {
      if (e.code === 'ControlLeft') {
        this.screenDevVisible = false
      }
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
