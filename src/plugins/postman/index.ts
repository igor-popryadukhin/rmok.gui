import Vue from 'vue'
import PostmanClient from './PostmanClient'
import { Cookie } from '@/plugins/cookie'

const cookie: Cookie = new Cookie()

const postmanClient = new PostmanClient(process.env.VUE_APP_POSTMAN_ENDPOINT, {
  auth: (cb) => {
    // Каждый раз получаем свежий токен
    // eslint-disable-next-line standard/no-callback-literal
    cb({
      token: cookie.get('access_token')
    })
  }
})

Vue.use({
  install () {
    Object.defineProperties(Vue.prototype, {
      $postmanClient: {
        get (): PostmanClient {
          return postmanClient
        }
      }
    })

    Vue.observable(postmanClient)
  }
})
