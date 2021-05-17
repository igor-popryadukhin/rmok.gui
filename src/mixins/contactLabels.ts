import Vue from 'vue'
import { Contacts } from '@/api/Contacts'

export default Vue.extend({
  created () {
    new Contacts()
      .getLabels()
      .then((response) => {
        /* eslint-disable */
        // @ts-ignore
        this.contactLabels = response
        /* eslint-enable */
      })
  },

  data () {
    return {
      contactLabels: [] as string[]
    }
  }
})
