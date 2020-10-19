import {
  ConnectingEvent,
  IncomingEvent,
  OutgoingEvent,
  RTCSession
} from 'jssip/lib/RTCSession'
import { makeAudioElement, removeAudioElement } from './utils'

export type Listener = (session: RTCSession, event: any) => void;

export enum JsSIPState {
  IDLE = 'idle',
  OUTGOING_CALL = 'outgoing_call',
  INCOMING_CALL = 'incoming_call',
  CONNECTING = 'connecting',
  ACCEPTED = 'accepted'
}

export class JsSIPSession {
  get state (): string {
    return this._state
  }

  get instance (): RTCSession {
    return this._instance
  }

  get seconds (): number {
    return this._seconds
  }

  get id (): string {
    return this._id
  }

  set onFailed (value: Listener) {
    this._onFailed = value
  }

  set onEnded (value: Listener) {
    this._onEnded = value
  }

  set onAccepted (value: Listener) {
    this._onAccepted = value
  }

  private readonly _id: string
  private readonly _instance: RTCSession
  private _timerId: any = undefined
  private _seconds = 0
  private _state: string = JsSIPState.IDLE
  private _onAccepted?: Listener
  private _onEnded?: Listener
  private _onFailed?: Listener

  /**
   * @param session
   */
  constructor (session: RTCSession) {
    this._id = session.id
    this._instance = session
    session.on('connecting', (event: ConnectingEvent) => {
      console.log('Session connecting')
      this._state = JsSIPState.CONNECTING
    })
    session.on('accepted', (event: IncomingEvent | OutgoingEvent) => {
      console.log('Session accepted')
      this._state = JsSIPState.ACCEPTED
      this.startTimer()
      this.doAcceptedListener(session, event)
    })
    session.on('ended', (event) => {
      console.log('Session ended')
      this._state = JsSIPState.IDLE
      this.stopTimer()
      removeAudioElement(session.id)
      this.doAcceptedEnded(session, event)
    })
    session.on('failed', (event) => {
      console.log('Session failed')
      this._state = JsSIPState.IDLE
      this.stopTimer()
      removeAudioElement(session.id)
      this.doFailed(session, event)
    })

    if (session.direction === 'outgoing') {
      session.connection.addEventListener('addstream', (e: any) => {
        const audioElement: HTMLAudioElement = makeAudioElement(session.id)
        audioElement.srcObject = e.stream
        audioElement.play()
      })
    }
    return this
  }

  public cancel () {
    this._instance.terminate()
  }

  private doAcceptedListener (session: RTCSession, event: any) {
    if (typeof this._onAccepted === 'function') {
      try {
        this._onAccepted(session, event)
      } catch (e) {
        console.log(e)
      }
    }
  }

  private doAcceptedEnded (session: RTCSession, event: any) {
    if (typeof this._onEnded === 'function') {
      try {
        this._onEnded(session, event)
      } catch (e) {
        console.log(e)
      }
    }
  }

  private doFailed (session: RTCSession, event: any) {
    if (typeof this._onFailed === 'function') {
      try {
        this._onFailed(session, event)
      } catch (e) {
        console.log(e)
      }
    }
  }

  private startTimer () {
    this._seconds = 0
    this._timerId = setInterval(() => {
      this._seconds++
    }, 1000)
  }

  private stopTimer () {
    clearInterval(this._timerId)
  }
}
