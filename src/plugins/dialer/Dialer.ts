import { Timer } from './Timer'
import JsSIP, { Utils as JsSIPUtils, UA, URI } from 'jssip'
import {
  ConnectingEvent,
  EndEvent,
  IncomingEvent,
  OutgoingEvent,
  RTCSession,
  AnswerOptions, RTCPeerConnectionDeprecated
} from 'jssip/lib/RTCSession'
import {
  CallOptions,
  ConnectedEvent,
  IncomingRTCSessionEvent,
  OutgoingRTCSessionEvent,
  RegisteredEvent, UnRegisteredEvent, UAConfiguration, UnRegisterOptions
} from 'jssip/lib/UA'
import debug from 'debug'

import { DisconnectEvent } from 'jssip/lib/WebSocketInterface'

function makeAudioElement (id?: string): HTMLAudioElement {
  const audioElement: HTMLAudioElement = document.createElement('audio')
  if (id) {
    audioElement.setAttribute('id', id)
  }
  audioElement.setAttribute('style', 'display: none')
  audioElement.setAttribute('controls', '')
  return audioElement
}

export interface DialerConfiguration {
  uri: string;
  password?: string;
  display_name?: string | undefined;
  realm?: string;
  pcConfig?: RTCConfiguration;
  candidateReadyTimeOut?: number;
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
  private _candidateReadyTimeoutId?: NodeJS.Timeout = null;
  private _candidateReadyTimeOut = 0;
  private _currentRTCSession?: RTCSession = null;

  constructor () {
    this._localAudio = makeAudioElement()
    this._remoteAudio = makeAudioElement()
    this._audioElementForRinging = makeAudioElement()

    this._localAudio.autoplay = true
    this._remoteAudio.autoplay = true

    this._timer = new Timer()
    this._state = DialerState.IDLE

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
      pcConfig: {
        iceServers: [],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rtcpMuxPolicy: 'negotiate'
      }, // this._pcConfig,
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

  public unregister (options?: UnRegisterOptions): void {
    if (this._ua) {
      DialerDebug('Unregister...')
      this._ua.unregister(options)
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

    this._candidateReadyTimeOut = config?.candidateReadyTimeOut || 0
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
    this._ua = this._ua?.off(event, handler)
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
      this._ua.off('registered', this.onRegistered.bind(this))
      this._ua.off('unregistered', this.onUnregistered.bind(this))
      this._ua.off('connected', this.onConnected.bind(this))
      this._ua.off('disconnected', this.onDisconnected.bind(this))
      this._ua.off('newRTCSession', this.onNewRTCSession.bind(this))
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

    if (this._candidateReadyTimeOut) {
      event.session.on('icecandidate', (event) => {
        DialerDebug(event.candidate.candidate)
        if (this._candidateReadyTimeoutId != null) {
          clearTimeout(this._candidateReadyTimeoutId)
        }
        this._candidateReadyTimeoutId = setTimeout(() => {
          event.ready()
        }, this._candidateReadyTimeOut)
      })
    }
    if (event.session.direction === 'incoming') {
      event.session.on('peerconnection', (event) => {
        event.peerconnection.ontrack = (ev) => {
          this._remoteAudio.srcObject = ev.streams[0]
        }
      })
    }

    event.session.on('connecting', () => {
      this._state = DialerState.CONNECTING
      this.startRenderSessionStopwatch()

      event.session.connection.ontrack = (te) => {
        this._remoteAudio.srcObject = te.streams[0]
      }
    })

    // Срабатывает при получении или генерации ответа класса 1XX SIP (> 100) на запрос INVITE
    event.session.on('progress', () => {
      this._state = DialerState.PROGRESS
    })

    // Срабатывает, когда вызов принят (2XX получено / отправлено).
    event.session.on('accepted', () => {
      this._state = DialerState.ACCEPTED
    })

    // Срабатывает, когда установленный вызов завершается.
    event.session.on('ended', () => {
      this._sessionEndTime = new Date()
      this.stopRenderSessionStopwatch()

      this._state = DialerState.IDLE
    })

    // Запускается, когда сеанс не может быть установлен.
    event.session.on('failed', () => {
      this._sessionEndTime = new Date()
      this.stopRenderSessionStopwatch()

      this._state = DialerState.IDLE
    })
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
