import Vue from 'vue'
import { GroupInterface, Groups } from '@/api/Groups'

export default Vue.extend({
  data () {
    return {
      groups: [] as GroupInterface[]
    }
  },

  created () {
    new Groups()
      .get()
      .then((response: GroupInterface[]) => {
        this.groups = response
      })
  }
})
