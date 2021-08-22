import Statuses from '@/api/Statuses'
import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Projects from '@/api/Projects'
import Users from '@/api/Users'
import Groups from '@/api/Groups'
import ContactTags from '@/api/ContactTags'
import Roles from '@/api/Roles'

const actions: ActionTree<State, RootState> = {
  async contact_tags ({ commit }, payload = {}) {
    return new ContactTags()
      .find(payload)
      .then((response) => {
        commit('contact_tags', response.data)
      })
  },

  async statuses ({ commit }, params = {}) {
    return new Promise<void>((resolve) => {
      new Statuses().find(params).then((statuses) => {
        commit('statuses', statuses)
      }).finally(resolve)
    })
  },

  async statuses_append ({ commit, state }, ids: number[]) {
    return new Statuses()
      .find({ ids })
      .then((statuses) => {
        if (statuses.length > 0) {
          commit('statuses', state.statuses.concat(statuses))
        }
      })
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
  },

  roles ({ commit }, payload = {}) {
    return new Roles()
      .find(payload)
      .then((response) => {
        commit('roles', response.data)
      })
  }
}

export default actions
