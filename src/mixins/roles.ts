import Vue from 'vue'
import { RoleInterface, Roles } from '@/api/Roles'

export default Vue.extend({
  data () {
    return {
      roles: [] as RoleInterface[]
    }
  },

  created () {
    new Roles()
      .get()
      .then((response: RoleInterface[]) => {
        this.roles = response
      })
  }
})
