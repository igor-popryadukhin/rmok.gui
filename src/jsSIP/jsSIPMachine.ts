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
import { ConnectedEvent } from 'jssip/lib/UA'
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'

interface ContextStateInterface {
  ua: UA;
  session?: RTCSession | null;
  seconds: number;
  app: Vue;
  target: string;
}

export let uaServices: any = null

// Events
function onJsSipUAConnected (event: ConnectedEvent) {
  console.log('UAEvent: connected', event)
}

function onJsSipUADisconnected (event: DisconnectEvent) {
  console.log('UAEvent: disconnected', event)
}

const eventHandlers: Partial<RTCSessionEventMap> = {
  /**
   * Fired after the local media stream is added into
   * RTCSession and before the ICE gathering starts for
   * initial INVITE request or “200 OK” response transmission.
   * @param event
   */
  connecting (event) {
    console.log('Session: connecting', event)
  },

  /**
   * Fired when an established call ends.
   * @param event
   */
  ended (event: EndEvent) {
    console.log('Session: ended', event)
    uaServices.send('ENDED')
  },

  /**
   * Fired when the call is accepted (2XX received/sent)
   * @param event
   */
  accepted (event: IncomingEvent | OutgoingEvent) {
    console.log('Session: accepted', event)
    uaServices.send('ACCEPTED')
  },

  /**
   * Fired when the local media is muted.
   * @param event
   */
  muted (event: MediaConstraints) {
    console.log('Session: muted', event)
  },

  unmuted (event: MediaConstraints) {
    console.log('Session: unmuted', event)
  },

  failed (event: EndEvent) {
    console.log('Session: failed', event)
    uaServices.send('FAILED')
  },

  progress (event: IncomingEvent | OutgoingEvent) {
    console.log('Session: progress', event)
  }
}

/**
 * Creating a new instance of an agent
 * @param context
 */
function createUAInstance (context: ContextStateInterface) {
  context.ua = JsSIPFactory.create('wss://84.201.164.37:8089/ws', {
    uri: 'sip:1002@84.201.164.37',
    password: '4e22df493698986b6bd2fa10c466562d'
  })
  context.app = app
}

/**
 * Initializing listeners
 * @param context
 */
function initListeners (context: ContextStateInterface) {
  console.log('Init listeners for ua...')
  context.ua.removeListener('connected', onJsSipUAConnected)
  context.ua.removeListener('disconnected', onJsSipUADisconnected)

  context.ua.addListener('connected', onJsSipUAConnected)
  context.ua.addListener('disconnected', onJsSipUADisconnected)
}

/**
 * Agent launch
 * @param context
 */
function startUa (context: ContextStateInterface) {
  context.ua.start()
}

/**
 * We call someone
 * @param context
 * @param payload
 */
function call (context: ContextStateInterface, payload: unknown | any) {
  context.target = payload.target
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
function entrySessionAccepted (context: ContextStateInterface) {
  context.seconds = 0
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
function entrySessionEnded (context: ContextStateInterface) {
  if (context.session) {
    console.log('context.session.start_time: ' + context.session.start_time.toLocaleString())
    console.log('context.session.end_time: ' + context.session.end_time.toLocaleString())
    // todo: Implement saving history
    // context.session.start_time
    // context.session.end_time
  }
}

/**
 * Terminates ongoing calls.
 * @param context
 */
function cancel (context: ContextStateInterface) {
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
      entry (context: ContextStateInterface, payload) {
        console.log('This is parking.')
      },
      on: {
        CALL: 'call',
        RECREATE: 'createUAInstance',
        ENDED: 'ended'
      }
    },

    createUAInstance: {
      entry: createUAInstance,
      on: {
        '': 'initEventListener'
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
      on: {
        '': 'parking'
      }
    },

    cancel: {
      entry: cancel,
      on: {
        '': 'parking'
      }
    }
  }
})

uaServices = interpret(uaMachine).start()
