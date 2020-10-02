import Vue from 'vue'

interface CookieOptionsInterface {
  [key: string]: string | Date | boolean | number;
}
/* eslint-disable */
export class Cookie {
  set (name: string, value: string, options: CookieOptionsInterface = {}) {

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

    for (const optionKey in options) {
      const optionValue = options[optionKey]
      if (optionKey === 'expires') {
        if (typeof optionValue === 'number') {
          updatedCookie += `;${optionKey}=${new Date(Date.now() + optionValue).toUTCString()}`
        } else if (optionValue instanceof Date) {
          updatedCookie += `;${optionKey}=${optionValue.toUTCString()}`
        }
      } else if (optionKey === 'secure') {
        if (optionValue === true) {
          updatedCookie += `;${optionKey}`
        }
      } else {
        updatedCookie += `;${optionKey}=${optionValue}`
      }
    }
    document.cookie = updatedCookie
  }

  get (name: string, def: any = null) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return def
  }

  has (name: string): boolean {
    return !!this.get(name, false)
  }

  delete (name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }
}
/* eslint-enable */

const $cookie: Cookie = new Cookie()

class CookiePlugin {
  install () {
    Object.defineProperties(Vue.prototype, {
      $cookie: {
        get (): Cookie {
          return $cookie
        }
      }
    })
  }
}

Vue.use(new CookiePlugin())
