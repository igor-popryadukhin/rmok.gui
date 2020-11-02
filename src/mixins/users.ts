import Vue from 'vue'
import { Users } from '@/api/Users'
import { debounce } from 'vuetify/src/util/helpers'

const users: any = Vue.extend({
  data () {
    return {
      usersSearchQuery: null,
      usersProcessLoading: false,
      usersSearchDebounce: debounce((q: string) => {
        new Users().find(q)
          .then(({ count, items }) => {
            (this as any).users = items
          })
      }, 400),
      users: []
    }
  },

  watch: {
    usersSearchQuery (val: string) {
      this.usersSearchDebounce(val)
    }
  }
})

export default users
