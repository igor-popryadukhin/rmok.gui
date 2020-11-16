<template>
  <div>
    <v-dialog
      v-model="dialogLoading.visible"
      :key="1"
      hide-overlay
      persistent
      width="300"
      light
    >
      <v-card
        color="primary"
        dark
        flat
      >
        <v-card-text>
          {{ dialogLoading.message }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
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

import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import { ATEConfigurationInterface, Configurations } from '@/api/Configurations'
import { JsSIP } from '@/jsSIP/plugin'
import {
  IncomingRTCSessionEvent,
  OutgoingRTCSessionEvent,
  UnRegisteredEvent
} from 'jssip/lib/UA'
import { POSITION } from 'vue-toastification'
import {
  ConnectingEvent,
  EndEvent,
  IncomingEvent,
  OutgoingEvent,
  RTCSession
} from 'jssip/lib/RTCSession'
import { Contacts } from '@/api/Contacts'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import VueI18n from 'vue-i18n'
import DStatusEdit from '@/components/Dialogs/DStatusEdit.vue'

interface HistoryDataInterface {
  /* eslint-disable */
  session_start_time: number;
  session_end_time: number;
  start_timestamp?: number;
  end_timestamp?: number;
  type: string;
  direction?: string;
  initiator?: string;
  target?: string;
  /* eslint-enable */
}

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
      dialogLoading: {
        visible: false,
        message: '' as string
      },
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
    this.$store.dispatch('project/load')
  },

  mounted () {
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
  },

  beforeDestroy () {
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
  },

  created () {
    setTimeout(() => {
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

      // This is the global session handler.
      this.$jsSIP.onSessionConnecting = (session: RTCSession, event: ConnectingEvent, payload: any) => {
        console.log('%c%s', 'color: blue;', 'Начало сессии')
      }

      /**
         * In the process of call...
         * Works on both incoming and outgoing calls
         * */
      this.$jsSIP.onSessionProgress = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
        /* eslint-disable */
          console.log('onSessionProgress...', event, session.direction, session, payload)

          // Incoming call processing
          if (session.direction === 'incoming') {
            const displayName: string = session.remote_identity.display_name
            new Contacts()
              .getByPhoneNumber(displayName)
              .then((data) => {
                //todo: Show contact call
                // this.contact = data
                // let phoneNumber = '...'
                // if ((this.$libPhoneNumberJs as LibPhoneNumberJs).parsePhoneNumber(displayName)?.isValid) {
                //   const pn: PhoneNumber = this.$libPhoneNumberJs.parsePhoneNumber(displayName)
                //   phoneNumber = pn.formatNational()
                // }

                // Update incoming call information in toast
                // this.updateRTCToast(session.id, `${data.first_name} ${data.last_name}`, phoneNumber)
              })
          }
          /* eslint-enable */
      }

      this.$jsSIP.onSessionAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
        console.log('onSessionAccepted...', event, session.direction, session, payload)
      }

      this.$jsSIP.onSessionEnded = (session: RTCSession, event: EndEvent, payload: any) => {
        /* eslint-disable */
          console.log('%c%s', 'color: blue;', 'Конец сессии')
          console.log('%c%s', 'color: blue;', '------------------------')
          console.log(event, session)
          console.log('%c%s', 'color: blue;', '------------------------')

        let historyData = {
          session_start_time: this.$jsSIP.sessionStartTime.getTime() / 1000,
          session_end_time: this.$jsSIP.sessionEndTime.getTime() / 1000,
          start_timestamp: session.start_time ? session.start_time.getTime() / 1000 : null,
          end_timestamp: session.end_time ? session.end_time.getTime() / 1000 : null,
          type: 'call',
          direction: session.direction
        } as HistoryDataInterface

        // If ATE did not return the call time, we delete zero data from the request
        if (historyData.start_timestamp == null) {
          delete historyData.start_timestamp
          delete historyData.end_timestamp
        }

        let contactId = 0;

        // End, remote side
        if (event.originator === 'remote') {
          // this.$toast.error(event.cause)
          //return
        } else if (event.originator === 'local') { // End, local side
          contactId = payload.contact_id
          historyData.target = payload.target

          if (event.cause === 'Canceled') {
            historyData.direction = session.direction + '_canceled'
          }
        }

        new Contacts()
          .addHistory(contactId, historyData)
          .then((id: number) => {
            if (this.$store.getters['project/statuses'].length > 0) {
              this.$dialog.show(DStatusEdit, {
                waitForResult: true,
                title: this.$t('Available statuses'),
                statuses: this.$store.getters['project/statuses'], // Statuses in current project
                saveTitle: this.$t('Save'),
                cancelTitle: this.$t('Cancel'),
                width: '60%',
                height: '600',
                onSave: (status: any) => {
                  new Contacts()
                    .updateHistory(id, {
                      status_id: status.id
                    }).finally(() => {
                      this.$root.$emit('root-contact-history-change')
                    })
                }
              })
            } else {
              this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
            }
          }).finally(() => {
            // After adding new data to history, we generate an event
            this.$root.$emit('root-contact-history-change')
            this.$root.$emit('jssip-session-cancel', { session, payload })
          })
          /* eslint-enable */
      }

      this.$jsSIP.onSessionFailed = (session: RTCSession, event: EndEvent, payload: any) => {
        /* eslint-disable */
          // this.$root.$emit('jssip-session-cancel', { session, payload })
          // console.log('onSessionFailed...', event.cause)
          /* eslint-enable */
      }
    }, 2000)
  },

  methods: {
    onJsSIPConnected (event: any) {
      console.log('%c%s', 'color: green;', 'JSSIP Connected')
    },

    onJsSIPDisconnected (event: any) {
      console.log('%c%s', 'color: green;', 'JSSIP Disconnected')
    },

    onJsSIPRegistrationFailed (event: UnRegisteredEvent) {
      console.log('%c%s', 'color: red;', 'JSSIP Failed: ' + event.cause)
    },

    onJsSIPNewRTCSession (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
      const session: RTCSession = event.session

      // Incoming call processing
      if (event.session.direction === 'incoming') {
        const displayName: string = event.request.from.display_name
        // const phoneNumber: PhoneNumber | undefined = parsePhoneNumber(displayName)

        // if (phoneNumber) {
        //   this.showRTCToast(this.$tc('unknown_number'), phoneNumber?.formatNational(), event.session.id)
        // }

        event.session.once('connecting', (event: ConnectingEvent) => {
          console.log('connecting', event)
        })
        event.session.once('ended', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
        event.session.once('failed', (event: EndEvent) => {
          this.$toast.dismiss(session.id)
        })
      } else if (event.session.direction === 'outgoing') {
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
    },

    tc (key: VueI18n.Path, choice: VueI18n.Choice, locale: VueI18n.Locale, values?: VueI18n.Values) {
      return this.$tc(key, choice, locale, values)
    },

    rootLoadingDataShow (message: '') {
      if (message) {
        this.dialogLoading.message = message
      } else {
        this.dialogLoading.message = this.$tc('Loading content...')
      }

      this.dialogLoading.visible = true
    },

    rootLoadingDataHide () {
      this.dialogLoading.message = ''
      this.dialogLoading.visible = false
    }
  }
})
</script>

<style lang="scss">
  html { overflow-y: hidden !important; }

  //.v-overlay {
  //  backdrop-filter: blur(1px);
  //}
  //
  //.v-overlay__scrim {
  //  backdrop-filter: blur(1px);
  //}
</style>
