/* eslint-disable */
import { JsSIPFactory, JsSPConfiguration } from './JsSIPFactory'
import {debug, UA} from 'jssip'
import {
  AnswerOptions, ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, PeerConnectionEvent,
  RTCSession
} from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import { makeAudioElement } from '@/jsSIP/utils'
import { Timer } from './Timer'
import { Debugger } from 'debug'

// Audio element for playing the sound of an incoming or outgoing call
const audioElementForCall: HTMLAudioElement = makeAudioElement('audio-jssip-call')
const audioElementForSound: HTMLAudioElement = makeAudioElement('audio-jssip-sound')

export type EventHandler = (...args: any[]) => void

/**
 * Call direction
 */
export enum Direction {
  /**
   * Incoming
   */
  INCOMING = 'incoming',

  /**
   * Incoming canceled
   */
  INCOMING_CANCELED = 'incoming_canceled',

  /**
   * Outgoing
   */
  OUTGOING = 'outgoing',

  /**
   * Outgoing canceled
   */
  OUTGOING_CANCELED = 'outgoing_canceled',

  /**
   * Missed
   */
  MISSED = 'missed'
}

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

export enum JsSIPState {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  ACCEPTED = 'accepted',
  PROGRESS = 'progress'
}

export class JsSIP {
  get uuid(): string {
    return this._uuid;
  }

  get sessionStopwatch (): string {
    return this._sessionStopwatch
  }

  get sessionEndTime (): Date {
    return this._sessionEndTime
  }

  get sessionStartTime (): Date {
    return this._sessionStartTime
  }

  /**
   * Returns true if the transport is connected, false otherwise.
   */
  get isConnected () {
    try {
     return this.ua.isConnected()
    } catch (e) {
      console.log('%c%s', 'color: red;', 'User Agent is not defined!')
      return false
    }
  }
  get session (): RTCSession | undefined {
    return this._session
  }

  get target (): string {
    return this._target
  }

  get state (): string {
    return this._state
  }

  set onSessionConnecting (value: EventHandler) {
    this._onSessionConnecting = value
  }

  set onSessionProgress (value: EventHandler) {
    this._onSessionProgress = value
  }

  set onSessionAccepted (value: EventHandler) {
    this._onSessionAccepted = value
  }

  set onSessionEnded (value: EventHandler) {
    this._onSessionEnded = value
  }

  set onSessionFailed (value: EventHandler) {
    this._onSessionFailed = value
  }

  private static playSound (name: string, loop = false) {
    if (!audioElementForSound.paused) {
      audioElementForSound.pause()
    }
    audioElementForSound.currentTime = 0.0
    audioElementForSound.src = '/sounds/' + name
    audioElementForSound.loop = loop
    audioElementForSound.play()
  }

  private static stopSound () {
    audioElementForSound.pause()
    audioElementForSound.currentTime = 0.0
  }

  private _uuid: string = ''
  private _payload: any = undefined
  private _target: string = ''
  private _session?: RTCSession
  private ua: UA
  private _timerId: any = undefined

  // Session time
  private _timer: Timer
  private _sessionStopwatchTimerId: any = undefined
  private _sessionStopwatch: string = '00:00:000'
  private _sessionStartTime: Date = new Date()
  private _sessionEndTime: Date = new Date()

  private _state: string = JsSIPState.IDLE
  private _onSessionConnecting?: EventHandler
  private _onSessionProgress?: EventHandler
  private _onSessionAccepted?: EventHandler
  private _onSessionEnded?: EventHandler
  private _onSessionFailed?: EventHandler

  constructor (url: string, config: JsSPConfiguration) {
    this._timer = new Timer()
    this._state = JsSIPState.IDLE
    this.ua = JsSIPFactory.create(url, {
      /* eslint-disable */
      uri: config.uri,
      display_name: config.display_name,
      password: config.password
      /* eslint-enable */
    })
    this.initializeListeners()
    return this
  }

  /**
   * call up
   * @param target
   * @param payload
   */
  public call (target: string, payload: any = null): RTCSession {
    this._payload = payload
    if (!this.ua) {
      throw new Error('Initialization required')
    }
    this._target = target
    this._uuid = this.generateUUID()
    /* eslint-disable */
    return this.ua.call(target, {
      extraHeaders: [
        'X-Call-Filename: ' + this._uuid
      ],
      pcConfig: {
        // @ts-ignore
        hackStripTcp: true, // Важно для хрома, чтоб он не тупил при звонке
        rtcpMuxPolicy: 'negotiate', // Важно для хрома, чтоб работал multiplexing. Эту штуку обязательно нужно включить на астере.
        iceServers: []
      },
      mediaConstraints: {
        audio: true, // Поддерживаем только аудио
        video: false
      },
      rtcOfferConstraints: {
        // @ts-ignore
        offerToReceiveAudio: 1, // Принимаем только аудио
        // @ts-ignore
        offerToReceiveVideo: 0
      }
    })
  }

  public answer (payload: any = null, options?: AnswerOptions) {
    if (payload) {
      this._payload = payload
    }
    JsSIP.playSound('answered.mp3')
    this._session?.answer(options)
  }

  /**
   * Cancel call
   */
  public cancel () {
    this.ua.terminateSessions()
  }

  /**
   * Change configuration
   * @param url
   * @param config
   */
  public setConfiguration (url: string, config: JsSPConfiguration) {
    this.ua = JsSIPFactory.create(url, {
      /* eslint-disable */
      uri: config.uri,
      display_name: config.display_name,
      password: config.password
      /* eslint-enable */
    })
    this.initializeListeners()
    return this
  }

  public setPayload (payload: any) {
    this._payload = payload
  }

  public start (): JsSIP {
    this.ua.start()
    return this
  }

  public stop (): JsSIP {
    this.ua.stop()
    return this
  }

  public on (event: string, handler: (...args: any[]) => void): JsSIP {
    (this.ua as UA).addListener(event, handler)
    return this
  }

  public off (event: string, handler: (...args: any[]) => void): JsSIP {
    (this.ua as UA).removeListener(event, handler)
    return this
  }

  public debug (namespace: string): void {
    debug.enable(namespace)
  }

  private initializeListeners () {
    this.ua.on('newRTCSession', (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) => {
      this._sessionStartTime = new Date()
      const session: RTCSession = event.session
      this._session = event.session

      // Запускается после добавления локального медиа потока RTCSession и
      // до начала сбора ICE для начального запроса INVITE или передачи ответа «200 OK».
      session.on('connecting', (event: ConnectingEvent) => {
        this._state = JsSIPState.CONNECTING
        this.startRenderSessionStopwatch()
        this.doSessionConnecting(session, event)
      })

      // Срабатывает при получении или генерации ответа класса 1XX SIP (> 100) на запрос INVITE
      session.on('progress', (event: IncomingEvent | OutgoingEvent) => {
        this._state = JsSIPState.PROGRESS

        if (session.direction === 'incoming') {
          JsSIP.playSound('ringing.ogg', true)
        }
        this.doSessionProgress(session, event)
      })

      // Срабатывает, когда вызов принят (2XX получено / отправлено).
      session.on('accepted', (event: IncomingEvent | OutgoingEvent) => {
        JsSIP.stopSound()
        JsSIP.playSound('answered.ogg', false)
        this._state = JsSIPState.ACCEPTED
        this.doSessionAccepted(session, event)
      })

      // Срабатывает, когда установленный вызов завершается.
      session.on('ended', (event: EndEvent) => {
        this._sessionEndTime = new Date()
        this.stopRenderSessionStopwatch()
        this._state = JsSIPState.IDLE
        this.doSessionEnded(session, event)
      })

      // Запускается, когда сеанс не может быть установлен.
      session.on('failed', (event: EndEvent) => {
        this._sessionEndTime = new Date()
        this.stopRenderSessionStopwatch()

        if (session.direction === 'outgoing') {
          JsSIP.playSound('rejected.mp3')
        } else {
          JsSIP.stopSound()
        }

        this._state = JsSIPState.IDLE

        this.doSessionEnded(session, event)
        this.doSessionFailed(session, event)
      })

      // Outgoing media stream
      if (session.direction === 'outgoing') {
        session.connection.addEventListener('addstream', (e: any) => {
          audioElementForCall.srcObject = e.stream
          audioElementForCall.play()
        })
      } else {
        // Incoming media stream
        session.once('peerconnection', (event: PeerConnectionEvent) => {
          event.peerconnection.addEventListener('addstream', (e: any) => {
            audioElementForCall.srcObject = e.stream
            audioElementForCall.play()
          })
        })
      }
    })
  }

  private doSessionConnecting (session: RTCSession, event: ConnectingEvent) {
    if (typeof this._onSessionConnecting === 'function') {
      try {
        this._onSessionConnecting(session, event, this._payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionAccepted (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    if (typeof this._onSessionAccepted === 'function') {
      try {
        this._onSessionAccepted(session, event, this._payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionEnded (session: RTCSession, event: EndEvent) {
    if (typeof this._onSessionEnded === 'function') {
      try {
        this._onSessionEnded(session, event, this._payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionFailed (session: RTCSession, event: EndEvent) {
    if (typeof this._onSessionFailed === 'function') {
      try {
        this._onSessionFailed(session, event, this._payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionProgress (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    if (typeof this._onSessionProgress === 'function') {
      try {
        this._onSessionProgress(session, event, this._payload)
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * Start rendering timer
   * @private
   */
  private startRenderSessionStopwatch () {
    this._timer.reset()
    this._timer.start()
    this._sessionStopwatchTimerId = setInterval(() => {
      this._sessionStopwatch = this._timer.render()
    }, 100)
  }

  /**
   * Stop rendering timer
   * @private
   */
  private stopRenderSessionStopwatch () {
    this._timer.stop()
    this._timer.reset()
    this._sessionStopwatch = '00:00:000'
    clearInterval(this._sessionStopwatchTimerId)
  }

  private generateUUID () {
    let d = new Date().getTime()
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0// Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16// random number between 0 and 16
      if (d > 0) { // Use timestamp until depleted
        r = (d + r) % 16 | 0
        d = Math.floor(d / 16)
      } else { // Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0
        d2 = Math.floor(d2 / 16)
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }
}
