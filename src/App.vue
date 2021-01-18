<template>
  <div>
    <div class="text-center">
      <v-overlay z-index="150" :value="overlay">
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

  created () {
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
  },

  beforeDestroy () {
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
  },

  methods: {

    rootLoadingDataShow () {
      this.overlay = true
    },

    rootLoadingDataHide () {
      this.overlay = false
    }
  }
})
</script>

<style lang="scss">
 html {
   overflow: auto;
 }

  //.v-overlay {
  //  backdrop-filter: blur(1px);
  //}
  //
  //.v-overlay__scrim {
  //  backdrop-filter: blur(1px);
  //}
</style>
