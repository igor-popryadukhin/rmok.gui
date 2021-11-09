import { Timer } from './Timer'
import JsSIP, { Utils as JsSIPUtils, UA } from 'jssip'
import {
  ConnectingEvent,
  EndEvent,
  IncomingEvent,
  OutgoingEvent,
  RTCSession,
  AnswerOptions
} from 'jssip/lib/RTCSession'
import {
  CallOptions,
  ConnectedEvent,
  IncomingRTCSessionEvent,
  OutgoingRTCSessionEvent,
  RegisteredEvent, UnRegisteredEvent, UAConfiguration
} from 'jssip/lib/UA'
import debug from 'debug'

import {
  EventHandlerAccepted,
  EventHandlerConnecting,
  EventHandlerEnded,
  EventHandlerFailed,
  EventHandlerProgress
} from './types'
import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'

export interface DialerConfiguration {
  uri: string;
  password?: string;
  display_name?: string | undefined;
  realm?: string;
  pcConfig?: RTCConfiguration;
}

export enum DialerState {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  ACCEPTED = 'accepted',
  PROGRESS = 'progress'
}

const DialerDebug = debug('Dialer')

export default class Dialer {
  get pcConfig (): RTCConfiguration { return this._pcConfig }
  set pcConfig (value: RTCConfiguration) { this._pcConfig = value }
  get sessionStartTime (): Date|null { return this._sessionStartTime }
  get sessionEndTime (): Date|null { return this._sessionEndTime }
  get sessionStopwatch (): string { return this._sessionStopwatch }

  get onSessionConnecting (): EventHandlerConnecting { return this._onSessionConnecting }
  set onSessionConnecting (value: EventHandlerConnecting) { this._onSessionConnecting = value }
  get onSessionFailed (): EventHandlerFailed { return this._onSessionFailed }
  /** Срабатывает, когда сеанс не может быть установлен. */
  set onSessionFailed (value: EventHandlerFailed) { this._onSessionFailed = value }
  get onSessionEnded (): EventHandlerEnded { return this._onSessionEnded }
  set onSessionEnded (value: EventHandlerEnded) { this._onSessionEnded = value }
  get onSessionAccepted (): EventHandlerAccepted { return this._onSessionAccepted }
  set onSessionAccepted (value: EventHandlerAccepted) { this._onSessionAccepted = value }
  get onSessionProgress (): EventHandlerProgress { return this._onSessionProgress }
  set onSessionProgress (value: EventHandlerProgress) { this._onSessionProgress = value }

  get state (): DialerState { return this._state }
  get direction (): string {
    if (this._currentRTCSession?.status === 8) {
      return 'indeterminate'
    }
    return this._currentRTCSession?.direction || 'indeterminate'
  }

  private _sessionStopwatchTimerId: NodeJS.Timeout;
  private _sessionStartTime?: Date = null;
  private _sessionEndTime?: Date = null;
  private _sessionStopwatch = '00:00:000';
  private _localAudio: HTMLAudioElement;
  private _remoteAudio: HTMLAudioElement;
  private _audioElementForRinging: HTMLAudioElement;
  private _timer: Timer;
  private _state: DialerState;
  private _ua?: UA = null;
  private _pcConfig?: RTCConfiguration = null;

  private _onSessionConnecting?: EventHandlerConnecting
  private _onSessionProgress?: EventHandlerProgress
  private _onSessionAccepted?: EventHandlerAccepted
  private _onSessionEnded?: EventHandlerEnded
  /**
   * Срабатывает, когда сеанс не может быть установлен.
   * @private
   */
  private _onSessionFailed?: EventHandlerFailed
  private _localClonedStream: any;
  private _currentRTCSession?: RTCSession = null;

  /**
   *
   * @param url
   * @param config
   */
  constructor (url: string, config?: DialerConfiguration) {
    this._localAudio = new Audio()
    this._remoteAudio = new Audio()
    this._audioElementForRinging = new Audio()

    this._localAudio.autoplay = true
    this._remoteAudio.autoplay = true

    this._timer = new Timer()
    this._state = DialerState.IDLE

    // this.configure(url, config)

    this._ua = new JsSIP.UA({
      sockets: [new JsSIP.WebSocketInterface(url)],
      uri: config.uri,
      password: config.password,
      display_name: config.display_name,
      register: true,
      realm: config.realm,
      contact_uri: config.uri,
      session_timers_refresh_method: 'invite',
      session_timers: true
    })

    return this
  }

  public setUAParameter<T extends keyof UAConfiguration> (parameter: T, value: UAConfiguration[T]): boolean {
    return this._ua.set(parameter, value)
  }

  public getUAParameter<T extends keyof UAConfiguration> (parameter: T): UAConfiguration[T] {
    return this._ua.get(parameter)
  }

  /**
   * Позвонить.
   *
   * @param number
   * @param pcConfig
   */
  public call (number: string): RTCSession {
    if (!this._ua) {
      throw new Error('User agent is not initialized!')
    }

    if (!this.isConnected()) {
      throw new Error('User agent is not connected')
    }

    this._currentRTCSession = this._ua.call(number, {
      extraHeaders: [],
      pcConfig: this._pcConfig,
      mediaConstraints: {
        audio: true, // Только аудио
        video: false
      },
      rtcOfferConstraints: {
        offerToReceiveAudio: true, // Принимаем только аудио
        offerToReceiveVideo: false
      },
      rtcAnswerConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      }
    })

    return this._currentRTCSession
  }

  public connect (): void {
    if (this._ua) {
      DialerDebug('Connecting...')
      this._ua.start()
    }
  }

  public disconnect (): void {
    if (this._ua) {
      DialerDebug('Disconnect...')
      this._ua.stop()
    }
  }

  public register (): void {
    if (this._ua) {
      DialerDebug('Registration...')
      this._ua.register()
    }
  }

  public isConnected (): boolean {
    return this._ua?.isConnected() || false
  }

  public isRegistered (): boolean {
    return Boolean(this._ua?.isRegistered())
  }

  /**
   * Ответить на входящий сеанс. Этот метод доступен только для входящих сеансов.
   * @param options
   */
  public answer (options?: AnswerOptions): void {
    if (this._currentRTCSession) {
      this._currentRTCSession.answer(options)
    }
  }

  /**
   * Положить трубку
   */
  public hangUp (options?: CallOptions): void {
    if (this._ua) {
      this._ua.terminateSessions(options)
    }
  }

  public mute (): void {
    if (this._currentRTCSession) {
      this._currentRTCSession.mute()
    }
  }

  public unmute (): void {
    if (this._currentRTCSession) {
      this._currentRTCSession.unmute()
    }
  }

  public isMuted (): boolean {
    return Boolean(this._currentRTCSession?.isMuted())
  }

  /**
   * @param url
   * @param config
   */
  public configure (url: string, config: DialerConfiguration) {
    this.unInitializeListeners()

    if (this._ua) {
      this._ua.stop()
      this._ua = null
    }

    this._ua = new JsSIP.UA({
      sockets: [new JsSIP.WebSocketInterface(url)],
      uri: config.uri,
      password: config.password,
      display_name: config.display_name,
      register: true,
      realm: config.realm,
      contact_uri: config.uri,
      session_timers_refresh_method: 'invite',
      session_timers: true
    })

    // Отписываемся от всех событий
    this.initializeListeners()
    return this
  }

  /**
   *
   * @param event
   * @param handler
   */
  public on (event: string, handler: (...args: any[]) => void): Dialer {
    this._ua = this._ua?.addListener(event, handler)
    return this
  }

  /**
   *
   * @param event
   * @param handler
   */
  public off (event: string, handler: (...args: any[]) => void): Dialer {
    this._ua = this._ua?.removeListener(event, handler)
    return this
  }

  /**
   *
   * @private
   */
  private initializeListeners () {
    this._ua.on('registered', this.onRegistered.bind(this))
    this._ua.on('unregistered', this.onUnregistered.bind(this))
    this._ua.on('connected', this.onConnected.bind(this))
    this._ua.on('disconnected', this.onDisconnected.bind(this))
    this._ua.on('newRTCSession', this.onNewRTCSession.bind(this))
  }

  /**
   *
   * @private
   */
  private unInitializeListeners () {
    if (this._ua) {
      this._ua.removeAllListeners('registered')
      this._ua.removeAllListeners('unregistered')
      this._ua.removeAllListeners('connected')
      this._ua.removeAllListeners('disconnected')
      this._ua.removeAllListeners('newRTCSession')
    }
  }

  private onRegistered (event: RegisteredEvent) {
    DialerDebug('Registered %o', event)
  }

  private onUnregistered (event: UnRegisteredEvent) {
    DialerDebug('Unregistered %o', event)
  }

  private onConnected (event: ConnectedEvent) {
    DialerDebug('Connected %o', event)
  }

  private onDisconnected (event: DisconnectEvent) {
    DialerDebug('Disconnected %o', event)
  }

  /**
   * Fired for an incoming or outgoing session/call.
   * @param event
   * @private
   */
  private onNewRTCSession (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) {
    this._sessionStartTime = new Date()
    this._currentRTCSession = event.session

    this._currentRTCSession.on('icecandidate', (event) => {
      DialerDebug(event.candidate.candidate)
    })

    // Запускается после добавления локального медиа потока RTCSession и
    // до начала сбора ICE для начального запроса INVITE или передачи ответа «200 OK».
    this._currentRTCSession.on('connecting', (event: ConnectingEvent) => {
      // Тут мы подключаемся к микрофону и цепляем к нему поток, который пойдёт в астер
      const peerconnection = this._currentRTCSession.connection
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._localClonedStream = peerconnection.getLocalStreams()[0]

      peerconnection.addEventListener('addstream', (event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._remoteAudio.srcObject = event.stream
      })

      this.doSessionConnecting(this._currentRTCSession, event)
    })

    // Срабатывает при получении или генерации ответа класса 1XX SIP (> 100) на запрос INVITE
    this._currentRTCSession.on('progress', (event: IncomingEvent | OutgoingEvent) => {
      this.doSessionProgress(this._currentRTCSession, event)
    })

    // Срабатывает, когда вызов принят (2XX получено / отправлено).
    this._currentRTCSession.on('accepted', (event: IncomingEvent | OutgoingEvent) => {
      this.doSessionAccepted(this._currentRTCSession, event)
    })

    // Срабатывает, когда установленный вызов завершается.
    this._currentRTCSession.on('ended', (event: EndEvent) => {
      // Закрываю локальный MediaStream
      JsSIPUtils.closeMediaStream(this._localClonedStream)
      this.doSessionEnded(this._currentRTCSession, event)
    })

    // Запускается, когда сеанс не может быть установлен.
    this._currentRTCSession.on('failed', (event: EndEvent) => {
      // Закрываю локальный MediaStream
      JsSIPUtils.closeMediaStream(this._localClonedStream)
      this.doSessionFailed(this._currentRTCSession, event)
    })
  }

  private doSessionConnecting (session: RTCSession, event: ConnectingEvent) {
    this._state = DialerState.CONNECTING
    this.startRenderSessionStopwatch()

    if (typeof this.onSessionConnecting === 'function') {
      try {
        this.onSessionConnecting(session, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * @param session
   * @param event
   * @private
   */
  private doSessionProgress (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    this._state = DialerState.PROGRESS

    if (typeof this.onSessionProgress === 'function') {
      try {
        this.onSessionProgress(session, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   *
   * @param session
   * @param event
   * @private
   */
  private doSessionAccepted (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
    this._state = DialerState.ACCEPTED

    if (typeof this.onSessionAccepted === 'function') {
      try {
        this.onSessionAccepted(session, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionEnded (session: RTCSession, event: EndEvent) {
    this._sessionEndTime = new Date()
    this.stopRenderSessionStopwatch()
    this._state = DialerState.IDLE

    if (typeof this.onSessionEnded === 'function') {
      try {
        this.onSessionEnded(session, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private doSessionFailed (session: RTCSession, event: EndEvent) {
    this._sessionEndTime = new Date()
    this.stopRenderSessionStopwatch()

    this._state = DialerState.IDLE

    if (typeof this.onSessionFailed === 'function') {
      try {
        this.onSessionFailed(session, event)
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   *
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
   *
   * @private
   */
  private stopRenderSessionStopwatch () {
    this._timer.stop()
    this._timer.reset()
    this._sessionStopwatch = '00:00:000'
    clearInterval(this._sessionStopwatchTimerId)
  }
}
