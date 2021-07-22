import { UserStatus } from '@/api/Account'
import { Configurations } from '@/api/Configurations'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import PBXInterface from '@/api/Schemas/PBXInterface'
import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import VToast from '@/components/VToast/VToast.vue'
import JSSIPPayloadInterface from '@/interfaces/JSSIPPayloadInterface'
import { REJssipSessionEndedInterface } from '@/interfaces/REJssipSessionEndedInterface'
import { JsSIP } from '@/jsSIP/plugin'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { UnRegisteredEvent } from 'jssip/lib/UA'
import Vue from 'vue'
import { POSITION } from 'vue-toastification'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'
import { mapGetters } from 'vuex'
import SipErrors from '@/api/SipErrors'

const jssip = Vue.extend({

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
      incomingDialogVisible: false,
      toastId: 0 as string | number
    }
  },

  beforeDestroy () {
    this.$root.$off('show-rtc-toast', this.showRTCToast)
    this.$root.$off('update-rtc-toast', this.updateRTCToast)
    this.$root.$off('root-jssip-initialize', this.jsSIPInitialize)
  },

  computed: {
    ...mapGetters({
      pcConfig: 'settings/pc_config'
    })
  },

  mounted () {
    this.$root.$on('show-rtc-toast', this.showRTCToast)
    this.$root.$on('update-rtc-toast', this.updateRTCToast)
    this.$root.$on('root-jssip-initialize', this.jsSIPInitialize) // Инициализация телефонии

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$store.subscribe(({ payload, type }) => {
      if (type === 'profile/setStatus') {
        if ([UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(payload)) {
          if (!this.$jsSIP.isConnected) {
            this.$jsSIP.start()
          }
        } else {
          if (this.$jsSIP.isConnected) {
            this.$jsSIP.stop()
          }
        }
      }
    }
    )
  },

  methods: {

    // Телефония
    jsSIPInitialize () {
      if (this.$isDebug) {
        console.log('%c%s', 'color: blue;', 'Инициализация RTC')
      }

      let audio_record_id: string | null = null

      /**
       * Инициализация JSSIP
       * Загружаю данные для авторизации и настройки телефонии.
       */
      new Configurations()
        .getATEConfigurations()
        .then((config: PBXInterface) => {
          console.log(config)
          // Проверяю наличие данных, сервер может вернуть пустые свойства
          if (config.server === '' || (config.login === '' && config.password === '')) {
            return this.$toast.error({
              component: VToast,
              props: {
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
                ],
                text: this.$t('Cause: {text}', { text: 'Нет параметров!' }),
                title: this.$tc('Error connecting to PBX')
              }
            }, { timeout: false })
          }

          // Отключаемся,если подключены, это нужно для того что бы корректно завершить сессию на Астериске
          if (this.$jsSIP.isConnected) {
            this.$jsSIP.stop()
          }

          // Асинхронно!
          // Подожди одну секунду
          setTimeout(() => {
            // Устанавливаю конфигурацию.
            // Фактически будет создан новый экземпляр this.$jsSIP
            this.$jsSIP.setConfiguration(`wss://${config.server}:${config.port}/ws`, {
              password: config.password,
              realm: config.server,
              uri: `sip:${config.login}@${config.server}`,
              pcConfig: {
                bundlePolicy: this.pcConfig.bundlePolicy,
                certificates: this.pcConfig.certificates,
                iceCandidatePoolSize: this.pcConfig.iceCandidatePoolSize,
                iceServers: this.pcConfig.iceServers,
                iceTransportPolicy: this.pcConfig.iceTransportPolicy,
                rtcpMuxPolicy: this.pcConfig.rtcpMuxPolicy
              }
            })

            // Далее инициализация слушателей
            // Глобальные обработчики
            this.$jsSIP.onSessionConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => {
              if (event.request.hasHeader('Call-ID')) {
                audio_record_id = event.request.getHeader('Call-ID')
              }

              if (this.$isDebug) {
                console.group('JsSIP: Начало сессии')
                console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.log(event)
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.groupEnd()
              }
            }

            /**
             * В процессе звонка, мы звоним, нам звонят.
             *
             * @param jssip
             * @param session
             * @param event
             */
            this.$jsSIP.onSessionProgress = async (jssip: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
              let target = ''
              if (session.direction === 'incoming') {
                target = session.remote_identity.display_name // Извлекаю номер телефона входящего звонка
              } else {
                target = jssip.target // Извлекаю номер телефона исходящего звонка
              }

              // Если входящий, определяем номер телефона
              if (session.direction === 'incoming') {
                new Contacts()
                  .getByPhoneNumber<ContactInterface>(target)
                  .then((response) => {
                    let displayPoneNumber = '...'
                    if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                      const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                      displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
                    }

                    // Мы обязаны положить значение в полезную нагрузку, что бы потом воспользоваться далее по жизненному циклу
                    // Реальные данные
                    jssip.setPayload<JSSIPPayloadInterface>({
                      contact_id: response.id,
                      target
                    })

                    // Отправляю событие для обновления тоста
                    this.$root.$emit('update-rtc-toast', {
                      data: {
                        displayName: `${response.first_name} ${response.last_name}`,
                        phoneNumber: displayPoneNumber
                      },
                      id: session.id
                    })
                  })

                let displayPoneNumber: string = target
                if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                  const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                  displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
                }

                this.$root.$emit('show-rtc-toast', {
                  data: {
                    displayName: displayPoneNumber, // Мы ещё не знаем кто, поэтому отображаем номер телефона
                    phoneNumber: displayPoneNumber
                  },
                  id: session.id
                })
              }

              if (this.$isDebug) {
                console.group('JsSIP: В процессе звонка...')
                console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
                console.log('%c%s', 'color: #ef00ff;', `Номер телефона: ${target}`)
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.log(event)
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.groupEnd()
              }
            }

            /**
             * Звонок принят.
             *
             * @param self
             * @param session
             * @param event
             */
            this.$jsSIP.onSessionAccepted = (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => {
              if (this.$isDebug) {
                console.group('JsSIP: Принятый')
                console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.log(event)
                console.log(session)
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.groupEnd()
              }
            }

            /**
             * Сессия завершена.
             *
             * @param self
             * @param session
             * @param event
             */
            this.$jsSIP.onSessionEnded = (self: JsSIP, session: RTCSession, event: EndEvent) => {
              // Прячу тост
              if (session.direction === 'incoming') {
                this.$toast.dismiss(session.id)
              }

              const historyData = {
                audio_record_id,
                cause: event.cause,
                direction: session.direction,
                originator: event.originator,
                session_end_time: self.sessionEndTime.getTime() / 1000,
                session_start_time: self.sessionStartTime.getTime() / 1000,
                type: 'call'
              } as any

              // Если есть время разговора
              if ((session.start_time) && (session.end_time)) {
                historyData.start_timestamp = session.start_time.getTime() / 1000
                historyData.end_timestamp = session.end_time.getTime() / 1000
              }

              let contactId = 0

              // Внимание!!!
              // Прежде чем получать значение полезной нагрузки, убедитесь что вы её туда положили
              contactId = self.getPayload<JSSIPPayloadInterface>().contact_id
              historyData.target = self.getPayload<JSSIPPayloadInterface>().target

              new Contacts()
                .addHistory(contactId, historyData)
                .then((id: number) => {
                  if (this.$store.getters['database/statuses_grouped'].length > 0) {
                    this.$root.$emit('root-jssip-session-ended', {
                      contact_history_id: id,
                      contact_id: contactId
                    } as REJssipSessionEndedInterface)
                  } else {
                    this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
                  }
                }).finally(() => {
                // Сообщаю, что история может быть обновлена
                  this.$root.$emit('root-contact-history-change')
                })

              if (this.$isDebug) {
                console.group('JsSIP: Завершение сессии')
                console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.log(event)
                console.log(session.direction)
                console.log(session)
                console.log('%c%s', 'color: green;', '----------------------------------------------------')
                console.groupEnd()
              }
            }

            /**
             * Произошла ошибка.
             *
             * @param self
             * @param session
             * @param event
             */
            this.$jsSIP.onSessionFailed = (self: JsSIP, session: RTCSession, event: EndEvent) => {
              // JsSIP.IncomingRequest or JsSIP.IncomingResponse instance generating the call failure when originator value is ‘remote’, null otherwise.
              if (this.$isDebug && event.message) {
                console.log(event.message)
              }

              if (event.originator === 'local') {
                // Локальный
                if (event.cause === 'Canceled') {
                  this.$toast.info('Call canceled')
                }
              } else if (event.originator === 'remote') {
                // Удалённый

                const message = event.message
                if (typeof message === 'object' && 'status_code' in message) {
                  if (message?.status_code === 480) {
                    /**
                     * Q.850 описание: No answer from the user
                     * SIP описание: Temporarily unavailable
                     */
                    if (/Q\.850;cause=19/.test(String((message as any)?.data || ''))) {
                      this.$toast.info('Subscriber unavailable')
                    } else {
                      this.$toast.error((message as any)?.data)
                    }
                  } else if (message?.status_code === 486) {
                    /**
                     * Абонент занят.
                     * ----------------------------
                     * Q.850 описание: User busy
                     * SIP описание: Busy here
                     */
                    if (/Q\.850;cause=17/.test(String((message as any)?.data || ''))) {
                      this.$toast.info('The subscriber is busy')
                    } else {
                      this.$toast.error((message as any)?.data)
                    }
                  } else if (message?.status_code === 503) {
                    /**
                     * Отсутствует доступный канал.
                     * Эта причина указывает на то, что в настоящее время нет подходящего канала для обработки вызова.
                     * ------------------------------------------------------------------------
                     * Q.850 описание: No circuit, channel unavailable
                     * SIP описание: Service unavailable
                     */
                    if (/Q\.850;cause=34/.test(String((message as any)?.data || ''))) {
                      this.$toast.info('Service unavailable')
                    } else {
                      this.$toast.error((message as any)?.data)
                    }
                    /**
                     * Ошибка SIP 603 обычно возвращается в качестве ответа,
                     * когда с вызываемой стороной был успешно установлен контакт,
                     * но она не может или не желает участвовать. Это сообщение об
                     * ошибке отправляется вашим сервером VoIP, и Zoiper просто отображает его.
                     */
                  } else if (message?.status_code === 603) {
                    this.$toast.info('Subscriber does not exist')
                  } else {
                    this.$toast.error((message as any)?.data)
                  }
                }
              }

              // Отправка логов c ошибками SIP на сервер
              if (event) {
                try {
                  new SipErrors().addLog({
                    message: event.cause,
                    context: JSON.stringify(event)
                  }).then()
                } catch (e) {
                  console.error(e)
                }
              }
            }

            /**
             * Ошибка регистрации
             */
            this.$jsSIP.on('registrationFailed', (event: UnRegisteredEvent) => {
              this.$toast.error({
                component: VToast,
                props: {
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
                  ],
                  text: this.$t('Cause: {text}', { text: event.cause }),
                  title: this.$tc('Error connecting to PBX')
                }
              }, { timeout: false })
            })

            // Запуск WEBRTC
            // Запуск если у пользователя установлен статус "Доступен"
            // UserStatus.AVAILABLE       Доступен. Полное отключение от астериска.
            // UserStatus.DO_NOT_DISTURB  Не беспокоить, но можно звонить.
            if ([UserStatus.AVAILABLE, UserStatus.DO_NOT_DISTURB].includes(this.$store.getters['profile/status'])) {
              this.$jsSIP.start()
            }
          }, 1000)
        })
    },

    /**
     * Ответить
     */
    onAnswer () {
      this.$jsSIP.answer()
    },

    /**
     * Положить трубку
     */
    onHangup () {
      this.$toast.dismiss(this.toastId) // Завершить тост
      this.$jsSIP.cancel()
    },

    /**
     * Показать окно входящего звонка
     * @param scope
     */
    showRTCToast (scope: { id: string | number; data: any }) {
      this.RTCToastOptions.id = scope.id
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        listeners: {
          answer: this.onAnswer,
          hangup: this.onHangup
        },
        props: {
          displayName: scope.data.displayName,
          phoneNumber: scope.data.displayName
        }
      }, this.RTCToastOptions)
    },

    updateRTCToast (scope: { id: string | number; data: any }) {
      this.$toast.update(scope.id, {
        content: {
          component: IncomingRTCSession,
          listeners: {
            answer: this.onAnswer,
            hangup: this.onHangup
          },
          props: {
            displayName: scope.data.displayName,
            phoneNumber: scope.data.phoneNumber
          }
        }
      })
    }
  }
})

export default jssip
