import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { ContactsState } from './state'
import { Contacts } from '@/api/Contacts'

const actions: ActionTree<ContactsState, RootState> = {
  items: ({ commit }: any, params = {}) => {
    commit('process_loading', true)
    new Contacts()
      .find(Object.assign(params, { fields: 'project,owner' }))
      .then((response) => {
        commit('total', response.meta?.count || 0)
        commit('items', response.data)
      }).finally(() => (commit('process_loading', false)))
  },

  unselect: ({ commit }) => {
    commit('selected', [])
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
