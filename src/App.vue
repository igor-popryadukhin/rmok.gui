<template>
  <v-fade-transition hide-on-leave>
    <component
      :is="layout"
      tabindex="-1"
      @keydown.ctrl="$root.$emit('on-keydown-ctrl')"
      @keyup.ctrl="$root.$emit('on-keyup-ctrl')"
    />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import { ATEConfigurationInterface, Configurations } from '@/api/Configurations'
import { JsSIP } from '@/jsSIP/plugin'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import { POSITION } from 'vue-toastification'
import { EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { JsSIPSession } from '@/jsSIP/JsSIPSession'

export default Vue.extend({
  name: 'App',
  data () {
    return {
      toastId: 0 as number | string
    }
  },
  computed: {
    layout () {
      return this.$route.meta.layout || 'clean'
    }
  },

  created () {
    new Configurations()
      .getATEConfigurations()
      .then((config: ATEConfigurationInterface) => {
        /* eslint-disable */
        (this.$jsSIP as JsSIP).setConfiguration(`wss://${config.server}:${config.port}/ws`, {
          uri: `sip:${config.login}@${config.server}`,
          display_name: config.display_name,
          password: config.password
        })
          .on('connected', this.onJsSIPConnected)
          .on('disconnected', this.onJsSIPDisconnected)
          .on('registrationFailed', this.onJsSIPRegistrationFailed)
          .on('newRTCSession', this.onJsSIPNewRTCSession)
          .on('sipEvent', this.onJsSIPSipEvent)
          .start()
        /* eslint-enable */
      })

    /**
     Это глобальный оработчик сессии.
     Сессия имеет
    **/

    this.$jsSIP.onSessionAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
      console.log('Session accepted: id = ' + session.id, event)
      // todo: Реализовать обработчик для состоявшегося звонка
    }

    this.$jsSIP.onSessionEnded = (session: RTCSession, event: EndEvent) => {
      console.log('Session ended: id = ' + session.id, event)
      // todo: Реализовать обработчик завершённого звонка
    }

    this.$jsSIP.onSessionFailed = (session: RTCSession, event: EndEvent) => {
      console.log('Session failed: id = ' + session.id, event)
      // todo: Реализовать обработчик если что-то пошло не так
    }

    this.$jsSIP.on('sessionCreated', (session: JsSIPSession) => {
      console.log('sessionCreated', session)
    })
  },

  methods: {
    onJsSIPConnected (event: any) {
      console.log('onJsSIPConnected', event)
    },

    onJsSIPDisconnected (event: any) {
      console.log('onJsSIPDisconnected', event)
    },

    onJsSIPRegistrationFailed (event: any) {
      console.log('onJsSIPRegistrationFailed', event)
    },

    onJsSIPNewRTCSession (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
      const session: RTCSession = event.session
      if (event.session.direction === 'incoming') {
        const displayName: string = event.request.from.display_name
        this.incomingRTCShow(displayName, event.session.id)
        event.session.on('connecting', (event: any) => {
          console.log('connecting', event)
        })
        event.session.on('ended', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
        event.session.on('failed', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
        event.session.on('update', (event: any) => {
          console.log('update', event)
        })
        event.session.on('progress', (event: IncomingEvent | OutgoingEvent) => {
          console.log('progress', event)
        })
        event.session.on('accepted', (event: IncomingEvent | OutgoingEvent) => {
          console.log('accepted', event)
        })
      }
    },

    onJsSIPSipEvent (event: any) {
      console.log(event)
    },

    incomingRTCShow (displayName: string, id: string | number) {
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        props: {
          displayName
        },
        listeners: {
          answerClick: () => {
            this.$jsSIP.answer()
          },

          cancelClick: () => {
            this.$toast.dismiss(this.toastId)
            this.$jsSIP.cancel()
          }
        }
      }, {
        id,
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
      })
    }
  }
})
</script>

<style lang="scss">
  html { overflow-y: hidden !important; }

  .v-overlay {
    backdrop-filter: blur(1px);
  }

  .v-overlay__scrim {
    backdrop-filter: blur(1px);
  }
</style>
