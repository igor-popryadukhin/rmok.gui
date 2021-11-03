import { io, Socket } from 'socket.io-client'
import { EventHandlerConnected, EventHandlerMessage } from './types'

type AuthCallable = (data: Record<string, string>) => void

interface PostmanClientOptions {
  auth: {
    [key: string]: any
  } | ((cb: AuthCallable) => void)
}

export default class PostmanClient {
  get onMessage (): EventHandlerMessage | null {
    return this._onMessage
  }

  set onMessage (value: EventHandlerMessage | null) {
    this._onMessage = value
  }

  get onConnect (): EventHandlerConnected | null {
    return this._onConnect
  }

  set onConnect (value: EventHandlerConnected | null) {
    this._onConnect = value
  }

  private readonly _socket: Socket
  private _onConnect: EventHandlerConnected|null
  private _onMessage: EventHandlerMessage|null

  /**
   *
   * @param uri
   * @param opt
   */
  constructor (uri: string, opt?: PostmanClientOptions) {
    this._socket = io(uri, {
      path: '/ws',
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: opt?.auth || {}
    })

    this._socket.on('connect', () => {
      if (typeof this._onConnect === 'function') {
        this._onConnect()
      }

      this._socket.on('message', (data: any) => {
        if (typeof this._onMessage === 'function') {
          this._onMessage(data)
        }
      })
    })
  }

  /**
   * Отправит текущее состояние о приложении на сервер.
   *
   * @param data
   */
  public sendState (data: any) {
    if (this._socket) {
      this._socket.send(data)
    } else {
      console.error('Failed to send data')
    }
  }
}
