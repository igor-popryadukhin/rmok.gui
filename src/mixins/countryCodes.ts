import Vue from 'vue'
import { Database } from '@/api/Database'

export default Vue.extend({
  data () {
    return {
      countryCodeSelected: null,
      countryCodes: [] as any[]
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
