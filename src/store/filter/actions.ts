import Statuses from '@/api/Statuses'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { FilterState } from './state'
import Projects from '@/api/Projects'
import Users from '@/api/Users'
import Groups from '@/api/Groups'
import ContactTags from '@/api/ContactTags'

const actions: ActionTree<FilterState, RootState> = {
  async contact_tags ({ commit }, payload = {}) {
    return new ContactTags()
      .find(payload)
      .then((response) => {
        commit('contact_tags', response.data)
      })
  },

  async statuses ({ commit }, payload = {}) {
    return commit('statuses', await new Statuses().find(payload))
  },

  projects ({ commit }, payload = {}) {
    return new Projects().find(payload)
      .then((response) => {
        commit('projects', response.data)
      })
  },

  users ({ commit }, payload = {}) {
    return new Users()
      .find(payload)
      .then((response) => {
        commit('users', response.data)
      })
  },

  users_groups ({ commit }, payload = {}) {
    return new Groups()
      .find(payload)
      .then((response) => {
        commit('users_groups', response.data)
      })
  }
}

export default actions
