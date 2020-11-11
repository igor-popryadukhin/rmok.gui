import Vue from 'vue'
import parsePhoneNumber, { CountryCode, PhoneNumber } from 'libphonenumber-js'

export class LibPhoneNumberJs {
  /**
   * @param text
   * @param defaultCountry
   */
  public parsePhoneNumber (text: string, defaultCountry?: CountryCode): PhoneNumber | undefined {
    return parsePhoneNumber(text, defaultCountry)
  }

  /**
   * Phone number validation
   * @param text
   * @param defaultCountry
   */
  public validate (text: string, defaultCountry?: CountryCode): boolean {
    const phoneNumber: PhoneNumber | undefined = this.parsePhoneNumber(text, defaultCountry)
    if (phoneNumber) {
      return phoneNumber.isValid()
    }
    return false
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
