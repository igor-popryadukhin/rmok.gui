import Vue from 'vue'
import parsePhoneNumber from 'libphonenumber-js'
import { CountryCode, PhoneNumber } from 'libphonenumber-js/types'

export class LibPhoneNumberJs {
  public parsePhoneNumber (text: string, defaultCountry?: CountryCode): PhoneNumber | undefined {
    return parsePhoneNumber(text, defaultCountry)
  }
}

const plugin: LibPhoneNumberJs = new LibPhoneNumberJs()

// tslint:disable-next-line:max-classes-per-file
class LibPhoneNumberJsPlugin {
  public install () {
    Object.defineProperties(Vue.prototype, {
      $libPhoneNumberJs: {
        get (): LibPhoneNumberJs {
          return plugin
        }
      }
    })
  }
}

Vue.use(new LibPhoneNumberJsPlugin())
