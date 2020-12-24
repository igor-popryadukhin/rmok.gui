<template>
  <div>
    <div class="text-center">
      <v-overlay z-index="99" :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
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

import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import { Configurations } from '@/api/Configurations'
import { JsSIP } from '@/jsSIP/plugin'
import {
  ConnectedEvent,
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
import PBXInterface from '@/api/Schemas/PBXInterface'
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'
import VToast from '@/components/VToast/VToast.vue'

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
    this.$root.$on('root-jssip-initialize', this.jsSIPInitialize) // Emit root-jssip-initialize for initialize JSSIP
    this.$root.$on('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$on('root-loading-data-hide', this.rootLoadingDataHide)
  },

  beforeDestroy () {
    this.$root.$off('root-jssip-initialize', this.jsSIPInitialize)
    this.$root.$off('root-loading-data-show', this.rootLoadingDataShow)
    this.$root.$off('root-loading-data-hide', this.rootLoadingDataHide)
  },

  methods: {
    jsSIPInitialize () {
      console.log('%c%s', 'color: green;', 'JsSIP: Инициализация...')
      const libphonenumberInitialize = () => import(/* webpackChunkName: "libphonenumber-js-plugin" */ '@/plugins/libphonenumber-js')
      const jssipInitialize = () => import(/* webpackChunkName: "jssip-plugin" */ '@/jsSIP')
        .then(() => {
          if (this.$jsSIP.isConnected) {
            this.$jsSIP.stop()
          }
          new Configurations()
            .getATEConfigurations()
            .then((config: PBXInterface) => {
            /* eslint-disable */
            (this.$jsSIP as JsSIP).setConfiguration(`wss://${config.server}:${config.port}/ws`, {
              uri: `sip:${config.login}@${config.server}`,
              password: config.password
            })
              .on('connected', this.onJsSIPConnected)
              .on('disconnected', this.onJsSIPDisconnected)
              .on('registered', this.onJsSIPRegistered)
              .on('registrationFailed', this.onJsSIPRegistrationFailed)
              .on('sipEvent', this.onJsSIPSipEvent)
              .on('newMessage', this.onJsSIPNewMessage)

            // Event Disconnected can happen later than Connected
            setTimeout(() => {
              this.$jsSIP.start()
            }, 1000)
            /* eslint-enable */
            })

          // Это глобальный обработчик сеанса.
          this.$jsSIP.onSessionConnecting = (session: RTCSession, event: ConnectingEvent, payload: any) => {
            // Слушатель событий в рамках одной сессии
            session.once('failed', (event: EndEvent) => {
              this.$toast.error(event.cause)
            })

            if (this.$isDebug) {
              console.group('JsSIP: Начало сессии')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }
          }

          this.$jsSIP.onSessionProgress = async (session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
          /* eslint-disable */
          if (event.originator === 'local') {
            if (session.direction === 'incoming') {

              // Incoming call identification
              const displayName: string = session.remote_identity.display_name
              new Contacts()
                .getByPhoneNumber(displayName)
                .then((data) => {
                  let phoneNumber: any = '...'
                  if (this.$libPhoneNumberJs.parsePhoneNumber(displayName)?.isValid) {
                    const pn = this.$libPhoneNumberJs.parsePhoneNumber(displayName)
                    phoneNumber = pn?.formatNational()
                    this.$jsSIP.setPayload({contact_id: data.id, target: pn?.format('E.164')})
                  }

                  this.updateRTCToast(session.id, `${data.first_name} ${data.last_name}`, phoneNumber)
                })

              this.showRTCToast(displayName, displayName, session.id)
            }
          } else {

          }
          /* eslint-enable */
          }

          this.$jsSIP.onSessionAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent, payload: any) => {
            if (this.$isDebug) {
              console.group('JsSIP: Принятый')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log(session)
              console.log(payload)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }
          }

          this.$jsSIP.onSessionEnded = (session: RTCSession, event: EndEvent, payload: any) => {
          /* eslint-disable */

            if (this.$isDebug) {
              console.group('JsSIP: Завершение сессии')
              console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.log(event)
              console.log(session.direction)
              console.log(session)
              console.log(payload)
              console.log('%c%s', 'color: green;', '----------------------------------------------------')
              console.groupEnd()
            }

          if (session.direction === 'incoming') {
            this.$toast.dismiss(session.id)
          }

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

          contactId = payload.contact_id
          historyData.target = payload.target

          if (event.cause === 'Canceled') {
            historyData.direction = session.direction + '_canceled'
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
        })

      libphonenumberInitialize()
        .finally(jssipInitialize)
    },

    onJsSIPConnected (event: ConnectedEvent) {
      if (this.$isDebug) {
        console.group()
        console.log('%c%s', 'color: green;', 'JsSIP: Соединение установлено.')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPDisconnected (event: DisconnectEvent) {
      if (this.$isDebug) {
        console.log('%c%s', 'color: blue;', 'JsSIP: Соединение разорвано.')
      }
    },

    onJsSIPRegistered (event: any) {
      if (this.$isDebug) {
        console.log('%c%s', 'color: green;', 'JsSIP: Зарегистрирован')
      }
    },

    onJsSIPRegistrationFailed (event: UnRegisteredEvent) {
      if (this.$isDebug) {
        console.log('%c%s', 'color: red;', 'JsSIP: Ошибка [' + event.cause + ']')
      }

      // Только в интерфейсе оператора выводим информацию об ошибке при подключении
      if (this.$store.getters['profile/role_is_operator']) {
        this.$toast.error({
          component: VToast,
          props: {
            title: this.$tc('Error connecting to PBX'),
            text: this.$t('Cause: {text}', { text: event.cause }),
            actions: [
              {
                attrs: {
                  label: this.$tc('Tune'),
                  style: { color: 'white' }
                },
                on: {
                  click: () => {
                    this.$router.push({ name: 'operator_settings_telephony' })
                  }
                }
              }
            ]
          }
        }, { timeout: false })
      }
    },

    onJsSIPSipEvent (event: any) {
      if (this.$isDebug) {
        console.group()
        console.log('%c%s', 'color: green;', 'JsSIP: Событие')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
    },

    onJsSIPNewMessage (event: any) {
      if (this.$isDebug) {
        console.group('JsSIP: Новое сообщение')
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.log(event)
        console.log('%c%s', 'color: green;', '----------------------------------------------------')
        console.groupEnd()
      }
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
          answer: this.onAnswer,
          hangup: this.onHangup
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
            answer: this.onAnswer,
            hangup: this.onHangup
          }
        }
      })
    },

    onAnswer () {
      this.$jsSIP.answer()
    },

    onHangup () {
      this.$toast.dismiss(this.toastId)
      this.$jsSIP.cancel()
    },

    tc (key: VueI18n.Path, choice: VueI18n.Choice, locale: VueI18n.Locale, values?: VueI18n.Values) {
      return this.$tc(key, choice, locale, values)
    },

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
  html { overflow-y: hidden !important; }

  //.v-overlay {
  //  backdrop-filter: blur(1px);
  //}
  //
  //.v-overlay__scrim {
  //  backdrop-filter: blur(1px);
  //}
</style>
