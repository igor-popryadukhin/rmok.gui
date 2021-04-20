import { Cookie } from '@/plugins/cookie'
import Vue from 'vue'
import { io, Socket } from 'socket.io-client'

const cookie: Cookie = new Cookie()

const uri = process.env.VUE_APP_PROCESS_ACTIVITY_URI || 'https://example.com'
const socket = io(uri, {
  auth: (cb) => {
    // Здесь каждый раз, будем брать актуальный токен доступа
    // eslint-disable-next-line standard/no-callback-literal
    cb({
      token: cookie.get('access_token')
    })
  },
  autoConnect: false,
  filter: {},
  path: '/activity',
  reconnection: true,
  transports: ['websocket']
})

interface QueryInterface {
  type: string;
  [key: string]: any
}

/**
 * Класс для выполнения записи активности пользователя во временном диапазоне
 */
export class Activity {
  private _socket: Socket

  constructor (socket: Socket) {
    this._socket = socket
  }

  /**
   * Начать действие
   */
  public begin (query: QueryInterface): void {
    if (!this._socket.connected) {
      this._socket.io.opts.query = query
      this._socket.connect()
    }
  }

  /**
   * Завершить действие
   */
  public end (): void {
    if (this._socket.connected) {
      this._socket.disconnect()
    }
  }
}

const activity = new Activity(socket)

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $activity: {
        get (): Activity {
          return activity
        }
      }
    })
  }
})

export const $activity = activity
