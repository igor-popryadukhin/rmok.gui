import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, rootGetters }, params = {}) => {
    console.log(rootGetters.routeParams)
    return new Promise<void>((resolve) => {
      const userId = rootGetters.routeParams.user_id
      $axios.get(`/users/${userId}/sessions`, { params })
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
