import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsState } from './state'
import { Contacts } from '@/api/Contacts'

const actions: ActionTree<ContactsState, RootState> = {
  items: ({ commit, state }: ActionContext<ContactsState, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      commit('process_loading', true)
      new Contacts()
        .find(Object.assign(params, { fields: 'project,owner', count: state.per_page }))
        .then((response) => {
          commit('total', response.meta?.count || 0)
          commit('items', response.data)
          resolve()
        }).catch(reject)
        .finally(() => (commit('process_loading', false)))
    })
  },

  unselect: ({ commit }) => {
    commit('selected', [])
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
