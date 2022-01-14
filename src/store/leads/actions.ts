import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { LeadsState } from './state'

const actions: ActionTree<LeadsState, RootState> = {
  fetch: ({ commit }) => {
    return new Promise<void>((resolve, reject) => {
      const query = { only_new: true }

      commit('items_fetching', true)

      $axios.get('/contacts', { params: query })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            commit('items', response.data?.data || [])
            commit('items_total', response.data?.meta?.count || 0)
            resolve()
          }
        }).catch(reject)
        .finally(() => (commit('items_fetching', false)))
    })
  },

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
