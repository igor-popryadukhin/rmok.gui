import { createMachine, assign } from 'xstate'
import Vue from 'vue'
import { JsSIP } from '@/jsSIP/plugin'
import { RTCSession } from 'jssip/lib/RTCSession'
import { causes } from 'jssip/lib/Constants'

enum SessionDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

type EventConnection = { type: 'CONNECTION', jssip: JsSIP, session: RTCSession, event: any }
type EventProgress = { type: 'PROGRESS', jssip: JsSIP, session: RTCSession, event: any }
type EventAccepted = { type: 'ACCEPTED', jssip: JsSIP, session: RTCSession, event: any }
type EventEnded = { type: 'ENDED', jssip: JsSIP, session: RTCSession, event: any }
type EventFailed = { type: 'FAILED', jssip: JsSIP, session: RTCSession, event: any }

type EventDirection = { type: SessionDirection, jssip: JsSIP, session: RTCSession, event: any }

type EventCause = { type: causes, jssip: JsSIP, session: RTCSession, event: any }

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
      entry (ctx, event) { ctx.$toast.info('IDLE', { timeout: 30000 }) },
      on: {
        CONNECTION: 'connection', // Происходит когда мы начинаем звонить
        PROGRESS: 'progress' // Происходит когда нам звонят
      }
    },

    connection: {
      entry (ctx, event) { ctx.$toast.info(`Event: ${event.type}`, { timeout: 30000 }) },
      on: {
        PROGRESS: 'progress',
        FAILED: 'failed'
      }
    },

    progress: {
      entry (ctx, event) { ctx.$toast.info(`Event: ${event.type}`, { timeout: 30000 }) },
      on: {
        ACCEPTED: 'accepted',
        ENDED: 'ended'
      }
    },

    accepted: {
      entry (ctx, event) { ctx.$toast.info(`Event: ${event.type}`, { timeout: 30000 }) },
      on: {
        ENDED: 'ended',
        FAILED: 'failed'
      }
    },

    ended: {
      initial: 'direction',
      states: {
        direction: {
          entry (ctx, event) { ctx.$toast.info('Слушаю направление звонка', { timeout: 30000 }) },
          on: {
            [SessionDirection.INCOMING]: SessionDirection.INCOMING,
            [SessionDirection.OUTGOING]: SessionDirection.OUTGOING
          }
        },

        [SessionDirection.INCOMING]: {
          entry (ctx, event) { ctx.$toast.info('Это входящий!', { timeout: 30000 }) },
          initial: 'idle',
          type: 'parallel',
          states: {
            idle: {
              on: {
                [causes.CANCELED]: causes.CANCELED,
                [causes.REJECTED]: causes.REJECTED
              }
            },

            [causes.CANCELED]: {
              entry (ctx, event) { ctx.$toast.info(`Event incoming: ${event.type}`, { timeout: 30000 }) }
            },

            [causes.REJECTED]: {
              entry (ctx, event) { ctx.$toast.info(`Event incoming: ${event.type}`, { timeout: 30000 }) }
            }
          }
        },

        [SessionDirection.OUTGOING]: {
          entry (ctx, event) { ctx.$toast.info('Это исходящий!') },
          initial: 'idle',
          type: 'parallel',
          states: {
            idle: {
              type: 'atomic',
              on: {
                [causes.CANCELED]: causes.CANCELED,
                [causes.REJECTED]: causes.REJECTED
              }
            },

            [causes.CANCELED]: {
              entry (ctx, event) { ctx.$toast.info(`Event outgoing: ${event.type}`) }
            },

            [causes.REJECTED]: {
              entry (ctx, event) { ctx.$toast.info(`Event outgoing: ${event.type}`) }
            }
          }
        }
      },
      entry (ctx, event) { ctx.$toast.info(`Event: ${event.type}`, { timeout: 30000 }) },
      always: 'idle'
    },

    failed: {
      entry (ctx, event) { ctx.$toast.info(`Event: ${event.type}`, { timeout: 30000 }) },
      always: 'idle'
    }
  }
})

export default callMachine
