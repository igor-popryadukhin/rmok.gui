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
import { mapGetters } from 'vuex'

export default Vue.extend({
  beforeCreate () {
    this.$store.dispatch('profile/loadProfile')
      .finally(() => {
        this.$root.$emit('root-jssip-initialize')
      })
    this.$store.dispatch('project/load')
  },

  beforeDestroy () {
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$off('on-keydown-ctrl', this.onKeyDown)
    this.$root.$off('on-keyup-ctrl', this.onKeyUp)
  },

  components: {
    VApp
  },

  computed: {
    layout () {
      return this.$route.meta.layout || 'clean'
    },

    ...mapGetters({
      // Текущая временная зона.
      profile_role_use: 'profile/role_use',
      profile_tz: 'profile/tz' // Текущая временная зона.
    })
  },

  created () {
    // Отложенная проверка корректности временной зоны пользователя.
    setTimeout(() => {
      this.checkTimeZoneSet()
    }, 10000)
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

  methods: {

    /**
     * Выполнить проверку корректности временной зоны пользователя.
     */
    checkTimeZoneSet () {
      let route_name = ''
      switch (this.profile_role_use) {
        case 'for_administration': {
          route_name = 'administrator_settings_regional'
          break
        }
        case 'for_calls': {
          route_name = 'operator_settings_regional'
        }
      }
      if (!this.profile_tz) {
        this.$toast.warning('Часовой пояс настроен неверно, нажмите на данное сообщение, чтобы настроить часовой пояс.', {
          onClick: () => {
            this.$router.push({ name: route_name })
          },
          timeout: 10000
        })
      }
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
    },

    rootLoadingDataHide () {
      this.overlay = false
    },

    rootLoadingDataShow () {
      this.overlay = true
    }
  },

  mounted () {
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
    this.$root.$on('on-keydown-ctrl', this.onKeyDown)
    this.$root.$on('on-keyup-ctrl', this.onKeyUp)
  },

  name: 'App'
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
