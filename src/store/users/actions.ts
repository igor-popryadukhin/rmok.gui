import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Users from '@/api/Users'

const actions: ActionTree<State, RootState> = {
  items: ({ commit, state }: any, payload = {}) => {
    return new Promise<void>((resolve, reject) => {
      commit('process_loading', true)

      const params: Record<string, string | number> = {}

      if (state.params.filter_project_id > 0) {
        params.project_id = state.params.filter_project_id
      }

      if (state.params.filter_q) {
        params.q = state.params.filter_q
      }

      if (state.params.filter_user_group_id) {
        params.user_group_id = state.params.filter_user_group_id
      }

      if (state.params.filter_offset) {
        params.offset = state.params.filter_offset
      }

      new Users()
        .find(Object.assign({ count: 50 }, params, payload))
        .then((response) => {
          commit('total', response.meta?.count || 0)
          commit('items', response.data)
          resolve()
        }).catch(reject)
        .finally(() => (commit('process_loading', false)))
    })
  }

}

export default actions
