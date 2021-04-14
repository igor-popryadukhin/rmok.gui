import { UserStatus } from '@/api/Account'
import { Configurations } from '@/api/Configurations'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import PBXInterface from '@/api/Schemas/PBXInterface'
import IncomingRTCSession from '@/components/IncomingRTCSession/IncomingRTCSession.vue'
import VToast from '@/components/VToast/VToast.vue'
import JSSIPPayloadInterface from '@/interface/JSSIPPayloadInterface'
import { REJssipSessionEndedInterface } from '@/interface/REJssipSessionEndedInterface'
import { JsSIP } from '@/jsSIP/plugin'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'
import { UnRegisteredEvent } from 'jssip/lib/UA'
import Vue from 'vue'
import { POSITION } from 'vue-toastification'
import { ToastOptions } from 'vue-toastification/dist/types/src/types'

const jssip = Vue.extend({

  data () {
    return {
      incomingDialogVisible: false,
      toastId: 0 as string | number,
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

  mounted () {
    this.$root.$on('show-rtc-toast', this.showRTCToast)
    this.$root.$on('update-rtc-toast', this.updateRTCToast)
    this.$root.$on('root-jssip-initialize', this.jsSIPInitialize) // Инициализация телефонии

    // Сразу проинициализируем телефонию.
    this.$root.$emit('root-jssip-initialize')

    this.$store.subscribe(
      ({ payload, type }) => {
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

  beforeDestroy () {
    this.$root.$off('show-rtc-toast', this.showRTCToast)
    this.$root.$off('update-rtc-toast', this.updateRTCToast)
    this.$root.$off('root-jssip-initialize', this.jsSIPInitialize)
  },

  methods: {

    // Телефония
    jsSIPInitialize () {
      if (this.$isDebug) {
        console.log('%c%s', 'color: blue;', 'Инициализация RTC')
      }

      /**
       * Инициализация JSSIP
       * Загружаю данные для авторизации и настройки телефонии.
       */
      new Configurations()
        .getATEConfigurations()
        .then((config: PBXInterface) => {
          // Проверяю наличие данных, сервер может вернуть пустые свойства
          if (config.server === '' || (config.login === '' && config.password === '')) {
            return this.$toast.error({
              component: VToast,
              props: {
                title: this.$tc('Error connecting to PBX'),
                text: this.$t('Cause: {text}', { text: 'Нет параметров!' }),
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
              uri: `sip:${config.login}@${config.server}`,
              password: config.password,
              realm: config.server
            })

            // Далее инициализация слушателей
            // Глобальные обработчики
            this.$jsSIP.onSessionConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => {
              // Слушатель событий в рамках одной сессии
              // TODO: Реализовать обработчик
              // session.on('failed', (event: EndEvent) => {
              //   ctx.$toast.error(event.cause)
              // })
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
                      id: session.id,
                      data: {
                        displayName: `${response.first_name} ${response.last_name}`,
                        phoneNumber: displayPoneNumber
                      }
                    })
                  })

                let displayPoneNumber: string = target
                if (this.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                  const pn = this.$libPhoneNumberJs.parsePhoneNumber(target)
                  displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
                }

                this.$root.$emit('show-rtc-toast', {
                  id: session.id,
                  data: {
                    displayName: displayPoneNumber, // Мы ещё не знаем кто, поэтому отображаем номер телефона
                    phoneNumber: displayPoneNumber
                  }
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
              let audioRecordId = null
              if (session.direction === 'incoming') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if ('X-Call-Filename' in session._request.headers) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  if (session._request.headers.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (session._request.headers['X-Call-Filename'][0].raw) {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      audioRecordId = session._request.headers['X-Call-Filename'][0].raw
                    }
                  }
                }
              } else {
                audioRecordId = self.uuid
              }

              // Прячу тост
              if (session.direction === 'incoming') {
                this.$toast.dismiss(session.id)
              }

              const historyData = {
                session_start_time: self.sessionStartTime.getTime() / 1000,
                session_end_time: self.sessionEndTime.getTime() / 1000,
                type: 'call',
                direction: session.direction,
                originator: event.originator,
                cause: event.cause
              } as any

              // Если есть идентификатор файла записи
              if (audioRecordId) {
                historyData.audio_record_id = audioRecordId
              }

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
                      contact_id: contactId,
                      contact_history_id: id
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
                console.log(`X-Call-Filename: ${audioRecordId}`)
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
              this.$toast.error(`Event: ${event.cause}`, { timeout: 3000 })
            }

            /**
             * Ошибка регистрации
             */
            this.$jsSIP.on('registrationFailed', (event: UnRegisteredEvent) => {
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
     * Показать окно входящего звонка
     * @param scope
     */
    showRTCToast (scope: { id: string | number; data: any }) {
      this.RTCToastOptions.id = scope.id
      this.toastId = this.$toast({
        component: IncomingRTCSession,
        props: {
          displayName: scope.data.displayName,
          phoneNumber: scope.data.displayName
        },
        listeners: {
          answer: this.onAnswer,
          hangup: this.onHangup
        }
      }, this.RTCToastOptions)
    },

    updateRTCToast (scope: { id: string | number; data: any }) {
      this.$toast.update(scope.id, {
        content: {
          component: IncomingRTCSession,
          props: {
            displayName: scope.data.displayName,
            phoneNumber: scope.data.phoneNumber
          },
          listeners: {
            answer: this.onAnswer,
            hangup: this.onHangup
          }
        }
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
    }
  }
})

export default jssip
