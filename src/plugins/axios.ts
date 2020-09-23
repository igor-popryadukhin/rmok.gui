import Vue from 'vue'
import axios, { AxiosInstance } from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/* eslint-disable */
const config = {
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  validateStatus (status: number) {
    return status < 500 // Resolve only if the status code is less than 500
  }
}
/* eslint-disable */

const _axios: AxiosInstance = axios.create(config)

_axios.interceptors.request.use(
  async function (config) {
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

/*
  Array of patterns to ignore status checks.
 */

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

class AxiosPlugin {
  install () {
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
