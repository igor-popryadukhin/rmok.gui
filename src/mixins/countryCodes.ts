import Vue from 'vue'
import { CountryCodeInterface, Database } from '@/api/Database'

export default Vue.extend({

  data () {
    return {
      countryCodeSelected: null,
      countryCodes: [] as CountryCodeInterface[]
    }
  },
  created () {
    new Database()
      .getCountryCodes()
      .then((response) => {
        /* eslint-disable */
        // @ts-ignore
        this.countryCodes = response
        /* eslint-enable */
      })
  }
})
