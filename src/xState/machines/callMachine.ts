import { createMachine } from 'xstate'
import Vue from 'vue'
import { JsSIP } from '@/jsSIP/plugin'
import { EndEvent, RTCSession } from 'jssip/lib/RTCSession'
import { causes } from 'jssip/lib/Constants'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import JSSIPPayloadInterface from '@/interface/JSSIPPayloadInterface'
import VStatusEditDialog from '@/components/VStatusEditDialog/VStatusEditDialog.vue'

enum SessionDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

interface EventConnection { type: 'CONNECTING', jssip: JsSIP, session: RTCSession, event: any }
interface EventProgress { type: 'PROGRESS', jssip: JsSIP, session: RTCSession, event: any }
interface EventAccepted { type: 'ACCEPTED', jssip: JsSIP, session: RTCSession, event: any }
interface EventEnded { type: 'ENDED', jssip: JsSIP, session: RTCSession, event: any }
interface EventFailed { type: 'FAILED', jssip: JsSIP, session: RTCSession, event: any }

interface EventDirection { type: SessionDirection, jssip: JsSIP, session: RTCSession, event: any }

interface EventCause { type: causes, jssip: JsSIP, session: RTCSession, event: any }

export type Event =
    | EventConnection
    | EventProgress
    | EventAccepted
    | EventEnded
    | EventFailed
    | EventCause
    | EventDirection

const callMachine = createMachine<Vue, Event>({
  id: 'toggle',
  initial: 'idle',
  states: {
    // В режиме ожидания
    idle: {
      on: {
        CONNECTING: 'connecting', // Происходит когда мы начинаем звонить
        PROGRESS: 'progress' // Происходит когда нам звонят
      }
    },

    connecting: {
      entry (ctx, { jssip, session, event }) {
        // Слушатель событий в рамках одной сессии
        // TODO: Реализовать обработчик
        // session.on('failed', (event: EndEvent) => {
        //   ctx.$toast.error(event.cause)
        // })
        if (ctx.$isDebug) {
          console.group('JsSIP: Начало сессии')
          console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.log(event)
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.groupEnd()
        }
      },
      on: {
        PROGRESS: 'progress',
        FAILED: 'failed'
      }
    },

    progress: {
      entry (ctx, { jssip, session, event }) {
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
              if (ctx.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
                const pn = ctx.$libPhoneNumberJs.parsePhoneNumber(target)
                displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
              }

              // Мы обязаны положить значение в полезную нагрузку, что бы потом воспользоваться далее по жизненному циклу
              // Реальные данные
              jssip.setPayload<JSSIPPayloadInterface>({
                contact_id: response.id,
                target
              })

              // Отправляю событие для обновления тоста
              ctx.$root.$emit('update-rtc-toast', {
                id: session.id,
                data: {
                  displayName: `${response.first_name} ${response.last_name}`,
                  phoneNumber: displayPoneNumber
                }
              })
            })

          let displayPoneNumber: string = target
          if (ctx.$libPhoneNumberJs.parsePhoneNumber(target)?.isValid) {
            const pn = ctx.$libPhoneNumberJs.parsePhoneNumber(target)
            displayPoneNumber = String(pn?.formatNational()) // Форматирую номер телефона
          }

          ctx.$root.$emit('show-rtc-toast', {
            id: session.id,
            data: {
              displayName: displayPoneNumber, // Мы ещё не знаем кто, поэтому отображаем номер телефона
              phoneNumber: displayPoneNumber
            }
          })
        }

        if (ctx.$isDebug) {
          console.group('JsSIP: В процессе звонка...')
          console.log('%c%s', 'color: green;', session.direction === 'outgoing' ? 'Исходящий' : 'Входящий')
          console.log('%c%s', 'color: #ef00ff;', `Номер телефона: ${target}`)
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.log(event)
          console.log('%c%s', 'color: green;', '----------------------------------------------------')
          console.groupEnd()
        }
      },
      on: {
        ACCEPTED: 'accepted',
        ENDED: 'ended'
      }
    },

    accepted: {
      on: {
        ENDED: 'ended',
        FAILED: 'failed'
      }
    },

    // Состояние, когда разговор завершён
    ended: {
      entry (ctx, { jssip, session, event }) {
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
          audioRecordId = jssip.uuid
        }

        // Прячу тост
        if (session.direction === 'incoming') {
          ctx.$toast.dismiss(session.id)
        }

        const historyData = {
          session_start_time: jssip.sessionStartTime.getTime() / 1000,
          session_end_time: jssip.sessionEndTime.getTime() / 1000,
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
        contactId = jssip.getPayload<JSSIPPayloadInterface>().contact_id
        historyData.target = jssip.getPayload<JSSIPPayloadInterface>().target

        new Contacts()
          .addHistory(contactId, historyData)
          .then((id: number) => {
            if (ctx.$store.getters['project/statuses'].length > 0) {
              // Диалог статуса звонка
              ctx.$dialog.show(VStatusEditDialog, {
                waitForResult: true,
                statuses: ctx.$store.getters['project/statuses'], // Статусы в текущем проекте
                width: ['xs', 'sm'].includes(ctx.$vuetify.breakpoint.name) ? '100%' : '60%',
                height: '600',
                onSave: (data: any) => {
                  new Contacts()
                    .updateHistory(id, {
                      status_id: data.status.id,
                      comment: data.comment
                    }).finally(() => {
                      // Сообщаю, что история может быть обновлена
                      ctx.$root.$emit('root-contact-history-change')
                    })
                }
              })
            } else {
              ctx.$toast.warning(ctx.$tc('The status cannot be set, because the project is configured incorrectly!'))
            }
          }).finally(() => {
          // Сообщаю, что история может быть обновлена
            ctx.$root.$emit('root-contact-history-change')
          })

        if (ctx.$isDebug) {
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
      },
      always: 'idle'
    },

    failed: {
      entry (ctx, event) { ctx.$toast.error(`Event: ${event.type}`, { timeout: 30000 }) },
      always: 'idle'
    }
  }
})

export default callMachine
