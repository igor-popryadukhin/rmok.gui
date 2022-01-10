import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { ProjectsListState } from './state'

const actions: ActionTree<ProjectsListState, RootState> = {
  fetch: ({ commit }: ActionContext<ProjectsListState, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {}

      commit('items_fetching', true)
      $axios.get('/projects', {
        params: query
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('total', response.data?.meta?.count || 0)
          commit('items', response.data?.data || [])
          resolve()
        }
      }).finally(() => (commit('items_fetching', false)))
    })
  }
}

export default actions
