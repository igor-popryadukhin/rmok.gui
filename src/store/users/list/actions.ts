import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { UserListState } from './state'

const actions: ActionTree<UserListState, RootState> = {
  fetch: ({ commit, state }) => {
    return new Promise<void>((resolve) => {
      commit('items_fetching', true)
      $axios.get('/users', {
        params: Object.assign(state.filter_query, { count: state.items_per_page })
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('items_total', response.data?.meta?.count || 0)
          commit('items', response.data?.data || [])
          resolve()
        }
      }).finally(() => (commit('items_fetching', false)))
    })
  },

  flush: ({ commit }: ActionContext<UserListState, RootState>) => {
    commit('flush')
  }
}

export default actions
