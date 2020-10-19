/* eslint-disable */
import { JsSIPFactory, JsSPConfiguration } from './JsSIPFactory'
import { UA } from 'jssip'
import {
  AnswerOptions, IncomingEvent, OutgoingEvent,
  RTCSession
} from 'jssip/lib/RTCSession'
import { IncomingRTCSessionEvent, OutgoingRTCSessionEvent } from 'jssip/lib/UA'
import { JsSIPSession, Listener } from '@/jsSIP/JsSIPSession'
import { EventEmitter } from '@/jsSIP/EventEmitter'

export class JsSIP {
  get eventEmitter (): EventEmitter {
    return this._eventEmitter;
  }
  private _target: string = ''
  private ua: UA
  private _sessions: Map<string, JsSIPSession> = new Map<string, JsSIPSession>()
  private _onSessionCreated?: (session: JsSIPSession) => void
  private _onSessionAccepted?: Listener
  private _onSessionEnded?: Listener
  private _onSessionFailed?: Listener
  private _eventEmitter: EventEmitter = new EventEmitter()

  constructor (url: string, config: JsSPConfiguration) {
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

  get sessions (): Map<string, JsSIPSession> {
    return this._sessions
  }

  get target () {
    return this._target
  }

  set target (value: string) {
    this._target = value
  }

  set onSessionCreated (value: (session: JsSIPSession) => void) {
    this._onSessionCreated = value
  }

  set onSessionAccepted (value: Listener) {
    this._onSessionAccepted = value
  }

  set onSessionEnded (value: Listener) {
    this._onSessionEnded = value
  }

  set onSessionFailed (value: Listener) {
    this._onSessionFailed = value
  }

  /**
   * call up
   * @param target
   */
  public call (target: string): RTCSession {
    if (!this.ua) {
      throw new Error('Initialization required')
    }
    this._target = target
    /* eslint-disable */
    return this.ua.call(target, {
      eventHandlers: {
        connecting: (event) => {
          console.log('connecting', event)
        },
        progress: (event: IncomingEvent | OutgoingEvent) => {
          console.log('progress', event)
        },
        accepted: (event: IncomingEvent | OutgoingEvent) => {
          console.log('accepted', event)
        },
        failed: (event) => {
          console.log('failed', event)
        }
      },
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

  public answer (id: string, options?: AnswerOptions) {
    if (this._sessions.has(id)) {
      const session: RTCSession = (this._sessions.get(id) as JsSIPSession).instance
      session.answer(options)
    }
  }

  /**
   * Cancel call
   */
  public cancel (id?: string) {
    if (id) {
      this.sessions.forEach((e) => {
        e.cancel()
      })
    } else {
      this.ua.terminateSessions()
    }
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

  public start (): JsSIP {
    console.log('Starting JsSIP...')
    this.ua.start()
    return this
  }

  public on (event: string, handler: (...args: any[]) => void): JsSIP {
    switch (event) {
      case 'sessionCreated': {
        this._eventEmitter.on(event, handler)
        break
      }
      case 'beforeDeleteSession': {
        this._eventEmitter.on(event, handler)
        break
      }

      default: (this.ua as UA).addListener(event, handler)
    }

    return this
  }

  public off (event: string, handler: (...args: any[]) => void): JsSIP {
    switch (event) {
      case 'sessionCreated': {
        this._eventEmitter.off(event)
        break
      }
      case 'beforeDeleteSession': {
        this._eventEmitter.off(event)
        break
      }

      default: (this.ua as UA).removeListener(event, handler)
    }

    return this
  }

  private initializeListeners () {
    this.ua.on('newRTCSession', (event: IncomingRTCSessionEvent | OutgoingRTCSessionEvent) => {
      console.log('newRTCSession', event)
      const jssipSession: JsSIPSession = new JsSIPSession(event.session)

      try {
        this.doCreatedSession(jssipSession)
      } catch (e) {
        console.error(e)
      }

      this._sessions.set(event.session.id, jssipSession)

      event.session.on('ended', () => {
        this.doBeforeDeleteSession(jssipSession)
        this._sessions.delete(event.session.id)
      })

      event.session.on('failed', () => {
        this.doBeforeDeleteSession(jssipSession)
        this._sessions.delete(event.session.id)
      })

      if (this._onSessionAccepted) {
        jssipSession.onAccepted = this._onSessionAccepted
      }
      if (this._onSessionEnded) {
        jssipSession.onEnded = this._onSessionEnded
      }

      if (this._onSessionFailed) {
        jssipSession.onFailed = this._onSessionFailed
      }
    })
  }

  private doCreatedSession (session: JsSIPSession) {
    this._eventEmitter.emit('sessionCreated', session)
  }

  private doBeforeDeleteSession (session: JsSIPSession) {
    this._eventEmitter.emit('beforeDeleteSession', session)
  }
}
