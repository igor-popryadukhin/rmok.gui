import Component from 'vue-class-component'
import { io, Socket } from 'socket.io-client'
import AppBase from '@/AppBase'
import debug from 'debug'
import debounce from '@/utils/debounce'
const postmanDebug = debug('APP').extend('POSTMAN')
const postmanMessageDebug = postmanDebug.extend('MESSAGE')

@Component
export default class Postman extends AppBase {
  private socket: Socket

  public created () {
    this.onAppStateChange = debounce(this.onAppStateChange, 350)

    this.$store.subscribe((mutation, state) => {
      if (/^app_state\/(.*?)/s.test(mutation.type)) {
        this.onAppStateChange()
      }
    })
  }

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

    setTimeout(this.updateState, 1000)
  }

  private updateState () {
    this.$store.commit('app_state/dialer_state', this.$dialer.state)
    this.$store.commit('app_state/dialer_connected', this.$dialer.isConnected())
    this.$store.commit('app_state/dialer_registered', this.$dialer.isRegistered())
  }

  private onAppStateChange () {
    if (this.socket) {
      this.socket.send(this.$store.getters['app_state/all'])
    }
  }
}
