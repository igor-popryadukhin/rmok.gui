import Vue from 'vue'
import { interpret, Machine } from 'xstate'
import { JsSIPFactory } from '@/jsSIP/JsSIPFactory'
import { UA } from 'jssip'
import {
  EndEvent,
  IncomingEvent,
  MediaConstraints,
  OutgoingEvent,
  RTCSession,
  RTCSessionEventMap
} from 'jssip/lib/RTCSession'
import { app } from '@/main'
import { ConnectedEvent, UnRegisteredEvent } from 'jssip/lib/UA'
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'
import { ATEConfigurationInterface, Configurations } from '@/api/Configurations'

/**
 * Call direction
 */
export enum Direction {
  /**
   * Missed
   */
  MISSED = 0,

  /**
   * Incoming
   */
  INCOMING = 1,

  /**
   * Incoming canceled
   */
  INCOMING_CANCELED = 1,

  /**
   * Outgoing
   */
  OUTGOING = 3,

  /**
   * Outgoing canceled
   */
  OUTGOING_CANCELED = 4
}

export interface ContextUAStateInterface {
  ua: UA;
  session: RTCSession;
  seconds: number;
  app: Vue;
  target: string;
  contact_id: number;
}

export let uaServices: any = null

/**
 * Call direction conversion
 * @param direction
 */
export function directionToNum (direction: string) {
  switch (direction) {
    case 'missed':
      return Direction.MISSED
    case 'incoming':
      return Direction.INCOMING
    case 'incoming_canceled':
      return Direction.INCOMING_CANCELED
    case 'outgoing':
      return Direction.OUTGOING
    case 'outgoing_canceled':
      return Direction.OUTGOING_CANCELED
    default: return -1
  }
}

// Events
function onJsSipUAConnected (event: ConnectedEvent) {
  // todo: Implement event handling
}

function onJsSipUADisconnected (event: DisconnectEvent) {
  // todo: Implement event handling
}

function onJsSipUARegistrationFailed (event: UnRegisteredEvent) {
  // todo: Implement event handling
}

const eventHandlers: Partial<RTCSessionEventMap> = {
  /**
   * Fired after the local media stream is added into
   * RTCSession and before the ICE gathering starts for
   * initial INVITE request or “200 OK” response transmission.
   * @param event
   */
  connecting (event) {
    // todo: Implement event handling
  },

  /**
   * Fired when an established call ends.
   * @param event
   */
  ended (event: EndEvent) {
    uaServices.send('ENDED')
  },

  /**
   * Fired when the call is accepted (2XX received/sent)
   * @param event
   */
  accepted (event: IncomingEvent | OutgoingEvent) {
    uaServices.send('ACCEPTED')
  },

  /**
   * Fired when the local media is muted.
   * @param event
   */
  muted (event: MediaConstraints) {
    // todo: Implement event handling
  },

  unmuted (event: MediaConstraints) {
    // todo: Implement event handling
  },

  failed (event: EndEvent) {
    uaServices.send('FAILED', event)
  },

  progress (event: IncomingEvent | OutgoingEvent) {
    // todo: Implement event handling
  }
}

/**
 * Creating a new instance of an agent
 * @param context
 */
async function createUAInstance (context: ContextUAStateInterface) {
  return new Promise(function (resolve) {
    if (context.ua instanceof UA) {
      if (context.ua.isConnected()) {
        context.ua.stop()
      }
    }

    // Loading configuration data
    new Configurations()
      .getATEConfigurations()
      .then((config: ATEConfigurationInterface) => {
        context.ua = JsSIPFactory.create(`wss://${config.server}/ws`, {
          /* eslint-disable */
          uri: `sip:${config.login}@${config.server}`,
          display_name: config.display_name,
          password: config.password
          /* eslint-enable */
        })
        context.app = app
        resolve(context)
      })
  })
}

/**
 * Initializing listeners
 * @param context
 */
function initListeners (context: ContextUAStateInterface) {
  context.ua.removeListener('connected', onJsSipUAConnected)
  context.ua.removeListener('disconnected', onJsSipUADisconnected)

  context.ua.addListener('connected', onJsSipUAConnected)
  context.ua.addListener('disconnected', onJsSipUADisconnected)
  context.ua.addListener('registrationFailed', onJsSipUARegistrationFailed)
}

/**
 * Agent launch
 * @param context
 */
function startUa (context: ContextUAStateInterface) {
  context.ua.start()
}

/**
 * We call someone
 * @param context
 * @param payload
 */
function call (context: ContextUAStateInterface, payload: unknown | any) {
  /* eslint-disable */
  context.contact_id = payload.contact_id
  context.target = payload.target
  /* eslint-enable */
  const session: RTCSession = context.ua.call(payload.target, {
    eventHandlers,
    pcConfig: {
      rtcpMuxPolicy: 'negotiate', // Важно для хрома, чтоб работал multiplexing. Эту штуку обязательно нужно включить на астере.
      iceServers: []
    },
    mediaConstraints: {
      audio: true, // Поддерживаем только аудио
      video: false
    }
  })
  context.session = session
  session.connection.addEventListener('addstream', (e: any) => {
    // Remote audio control
    const audio: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement
    audio.srcObject = e.stream
    audio.play()
  })
}

let sessionTimerIntervalID: any = null

/**
 * @param context
 */
function entrySessionAccepted (context: ContextUAStateInterface) {
  context.seconds = 0

  // Run internal counter
  sessionTimerIntervalID = setInterval(() => {
    context.seconds++
  }, 1000)
}

/**
 * Delete timer
 * @constructor
 */
function exitSessionAccepted () {
  clearInterval(sessionTimerIntervalID)
}

/**
 * Occurs after the machine enters the state "ended"
 * @param context
 */
function entrySessionEnded (context: ContextUAStateInterface) {
  context.app.$emit('jssip-session-ended', context)
}

/**
 *
 * @param context
 * @param payload
 */
function entrySessionFailed (context: ContextUAStateInterface, payload: any) {
  context.app.$emit('jssip-session-failed', context, payload)
}

/**
 * Terminates ongoing calls.
 * @param context
 */
function entryCancelSession (context: ContextUAStateInterface) {
  context.app.$emit('jssip-session-cancel', context)
  context.ua.terminateSessions()
}

export const uaMachine = Machine({
  id: 'UAMachine',
  context: {
    ua: null, // UA
    session: null, // Current call session
    seconds: 0,
    app: null, // Vue app instance
    target: '' // Current phone number
  } as any,
  initial: 'createUAInstance',
  states: {

    // Idle
    parking: {
      on: {
        CALL: 'call',
        RECREATE: 'createUAInstance',
        ENDED: 'ended'
      }
    },

    createUAInstance: {
      invoke: {
        src: createUAInstance,
        onDone: {
          target: 'initEventListener'
        }
      }
    },

    initEventListener: {
      entry: initListeners,
      on: {
        '': 'startUa'
      }
    },

    startUa: {
      entry: startUa,
      on: {
        '': 'parking'
      }
    },

    call: {
      entry: call,
      on: {
        CANCEL: 'cancel',
        ACCEPTED: 'accepted',
        FAILED: 'failed'
      }
    },

    accepted: {
      entry: entrySessionAccepted,
      exit: exitSessionAccepted,
      on: {
        CANCEL: 'cancel',
        ENDED: 'ended'
      }
    },

    ended: {
      entry: entrySessionEnded,
      on: {
        '': 'parking'
      }
    },

    failed: {
      entry: entrySessionFailed,
      on: {
        '': 'parking'
      }
    },

    cancel: {
      entry: entryCancelSession,
      on: {
        '': 'parking'
      }
    }
  }
})

uaServices = interpret(uaMachine).start()
