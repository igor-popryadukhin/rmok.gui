import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {
  /**
   *
   * @param commit
   * @param rootGetters
   */
  fetch ({ commit, rootGetters }) {
    return new Promise<void>((resolve, reject) => {
      commit('fetching', true)
      $axios
        .get(`/roles/${rootGetters.routeParams.id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('role_name', response.data.name)
          commit('role_permissions', response.data.permissions)

          resolve()
        }).catch(reject)
        .finally(() => (commit('fetching', false)))
    })
  }
}

export default actions
