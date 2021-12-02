import Component from 'vue-class-component'
import { io } from 'socket.io-client'
import AppBase from '@/AppBase'
import debug from 'debug'
const postmanDebug = debug('APP').extend('POSTMAN')
const postmanMessageDebug = postmanDebug.extend('MESSAGE')

@Component
export default class Postman extends AppBase {
  private socket

  public mounted () {
    if ('VUE_APP_POSTMAN_ENDPOINT' in process.env) {
      postmanDebug('Инициализация...')
      this.socket = io(process.env.VUE_APP_POSTMAN_ENDPOINT, {
        path: '/ws',
        autoConnect: true,
        transports: ['websocket', 'polling'],
        auth: (cb) => {
          // Каждый раз получаем свежий токен
          // eslint-disable-next-line standard/no-callback-literal
          cb({
            token: this.$cookie.get('access_token')
          })
        }
      })

      this.socket.on('connect', () => {
        postmanDebug('Подключен')

        this.socket.on('message', (data: any) => {
          postmanMessageDebug('%o', data)
        })

        this.socket.on('disconnect', (data: any) => {
          postmanDebug('Отключен')
        })
      })
    } else {
      console.warn('Модуль "Postman" не активен!')
    }
  }
}
