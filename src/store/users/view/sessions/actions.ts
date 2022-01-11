import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { SessionsState } from './state'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<SessionsState, RootState> = {
  fetch: ({ commit, rootGetters }, params = {}) => {
    console.log(rootGetters.routeParams)
    return new Promise<void>((resolve) => {
      $axios.get(`/users/${rootGetters.routeParams.id}/sessions`, { params })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.statusText)
          }

          commit('items', response.data?.data || [])
          resolve()
        })
    })
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
