import { app } from '@/main'
import { Cookie } from '@/plugins/cookie'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Vue from 'vue'
import { sleep } from '@/Utils'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* eslint-disable */
const config = {
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: process.env.NODE_ENV === 'development',
  validateStatus (status: number) {
    return status < 500 // Resolve only if the status code is less than 500
  }
}
/* eslint-enable */

const _axios: AxiosInstance = axios.create(config)
const cookie: Cookie = new Cookie()
let isRefreshTokenProcess = false
const promises: any[] = []

if (process.env.NODE_ENV === 'development') {
  // Связан с параметром withCredentials
  cookie.set('XDEBUG_SESSION', 'PHPSTORM', { path: '/' })
}

/* eslint-disable */
// @ts-ignore
_axios.interceptors.request.use(async (config: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig> => {

  // todo: set locale optional
  config.headers.Language = 'ru'

  if (isRefreshTokenProcess) {
    console.log('%c%s', 'color: red;', `Запрос ${config.url} ожидает обновление токена...`)
    promises.push(new Promise<void>(async (resolve) => {
      while (isRefreshTokenProcess) {
        await sleep(500)
      }
      console.log('%c%s', 'color: green;', `Запрос ${config.url} разрешён!`)
      resolve()
    }))
    // This is process update token
    await Promise.all(promises)
  }

  if (cookie.has('access_token')) {
      config.headers.Authorization = `Bearer ${cookie.get('access_token')}`
      return config
    } else {
      if (cookie.has('refresh_token')) {
        console.log('%c%s', 'color: blue;', 'Обновление токена...')
        isRefreshTokenProcess = true
        await axios.post(`${process.env.VUE_APP_API}/account/authorization/refresh-token`, {
          refresh_token: cookie.get('refresh_token')
        }).then((response: AxiosResponse) => {
          if (response.status === 200) {
            cookie.set('access_token', response.data.access_token, { 'max-age': 86400, 'path': '/' })
            cookie.set('refresh_token', response.data.refresh_token, { 'max-age': 31536000, 'path': '/' })
            config.headers.Authorization = `Bearer ${cookie.get('access_token')}`
          }
        }).catch(() => {
          app.$router.replace({ name: 'login' }).then()
        })
      }
      isRefreshTokenProcess = false
      return Promise.resolve(config)
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
/* eslint-disable */
/*
  Array of patterns to ignore status checks.
 */

// Add a response interceptor
_axios.interceptors.response.use(
  (response): Promise<AxiosResponse> | any => {
    if (response.status === 401) {
      return app.$router.replace({ name: 'login' }).finally(() => Promise.reject(response))
    } else {
      return response
    }
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

class AxiosPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      axios: {
        get () {
          return _axios
        }
      },
      $axios: {
        get () {
          return _axios
        }
      }
    })
  }
}

const axiosPlugin: AxiosPlugin = new AxiosPlugin()

Vue.use(axiosPlugin)

export default axiosPlugin
export const $axios: AxiosInstance = _axios
