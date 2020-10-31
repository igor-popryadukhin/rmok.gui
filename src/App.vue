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
import { directionToNum, JsSIP } from '@/jsSIP/plugin'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import { POSITION } from 'vue-toastification'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { Contacts } from '@/api/Contacts'
import { PhoneNumber } from 'libphonenumber-js'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({
  name: 'App',
  data () {
    return {
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
     * Это глобальный оработчик сессии.
    **/
    this.$jsSIP.onSessionConnecting = (session: RTCSession, event: ConnectingEvent, payload: any) => {
      console.log('onSessionConnecting...', event, session.direction, session, payload)
      if (session.direction === 'outgoing') {

      } else {

      }
    }

    /**
     * In the process of call...
     * Works on both incoming and outgoing calls
     **/
    this.$jsSIP.onSessionProgress = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
      /* eslint-disable */
      console.log('onSessionProgress...', event, session.direction, session, payload)

      // Incoming call processing
      if (session.direction === 'incoming') {
        const displayName: string = session.remote_identity.display_name
        new Contacts()
          .getByPhoneNumber(displayName)
          .then((data) => {
            this.contact = data
            let phoneNumber = '...'
            if (this.$libPhoneNumberJs.parsePhoneNumber(displayName)?.isValid) {
              const pn: PhoneNumber = this.$libPhoneNumberJs.parsePhoneNumber(displayName)
              phoneNumber = pn.formatNational()
            }

            // Update incoming call information in toast
            this.updateRTCToast(session.id, `${data.first_name} ${data.last_name}`, phoneNumber)
          })
      }
      /* eslint-enable */
    }

    this.$jsSIP.onSessionAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
      console.log('onSessionAccepted...', event, session.direction, session, payload)
      if (session.direction === 'outgoing') {

      } else {

      }
    }

    this.$jsSIP.onSessionEnded = (session: RTCSession, event: EndEvent, payload: any) => {
      /* eslint-disable */

      const date: Date = new Date()
      let start_time: Date = session.start_time ?? date
      let end_time: Date = session.end_time ?? date

      // If this is an incoming call, then the payload must be present
      if (payload) {
        debugger
        if ({}.hasOwnProperty.call(payload, 'contact_id')) {

          const { contact_id, target } = payload

          new Contacts()
            .addHistory(contact_id, {
              start_timestamp: start_time?.getTime() / 1000,
              end_timestamp: end_time?.getTime() / 1000,
              direction: directionToNum(session.direction),
              target
            }).finally(() => {
            // After adding new data to history, we generate an event
            this.$root.$emit('jssip-session-cancel', { session, payload })
          })

        }
      }
      /* eslint-enable */
    }

    this.$jsSIP.onSessionFailed = (session: RTCSession, event: EndEvent, payload: any) => {
      this.$root.$emit('jssip-session-cancel', { session, payload })
      console.log('onSessionFailed...', event, session.direction, session)
    }
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

      // Incoming call processing
      if (event.session.direction === 'incoming') {
        const displayName: string = event.request.from.display_name
        let phoneNumber = ''

        if (this.$libPhoneNumberJs.parsePhoneNumber(displayName)?.isValid) {
          phoneNumber = this.$libPhoneNumberJs.parsePhoneNumber(displayName)?.formatNational()
        }

        this.showRTCToast(this.$tc('unknown_number'), phoneNumber, event.session.id)

        event.session.once('connecting', (event: ConnectingEvent) => {
          console.log('connecting', event)
        })
        event.session.once('ended', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
        event.session.once('failed', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
      } else {
        // Outgoing call processing
      }
    },

    onJsSIPSipEvent (event: any) {
      console.log(event)
    },

    showRTCToast (displayName: string, phoneNumber: string, id: string | number) {
      this.RTCToastOptions.id = id
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        props: {
          displayName,
          phoneNumber
        },
        listeners: {
          answerClick: this.onAnswerClick,
          cancelClick: this.onCancelClick
        }
      }, this.RTCToastOptions)
    },

    updateRTCToast (toastId: string | number, displayName: string, phoneNumber: string) {
      this.$toast.update(toastId, {
        content: {
          component: IncomingRTCSession,
          props: {
            displayName,
            phoneNumber
          },
          listeners: {
            answerClick: this.onAnswerClick,
            cancelClick: this.onCancelClick
          }
        }
      })
    },

    onAnswerClick () {
      this.$jsSIP.answer()
    },

    onCancelClick () {
      this.$toast.dismiss(this.toastId)
      this.$jsSIP.cancel()
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
