import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { RolesState } from './state'
import { $axios } from '@/plugins/axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<RolesState, RootState> = {
  /**
   *
   * @param commit
   * @param state
   */
  fetch ({ commit, state }) {
    return new Promise<void>((resolve) => {
      commit('items_fetching', true)
      $axios
        .get('/roles', {
          params: {
            offset: state.items_offset,
            count: state.items_count
          }
        })
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('items', response.data?.data || [])
          resolve()
        }).finally(() => (commit('items_fetching', false)))
    })
  }
}

export default actions
