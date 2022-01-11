import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { ProjectsViewPeopleState } from './state'

const actions: ActionTree<ProjectsViewPeopleState, RootState> = {
  fetch: ({ commit, rootGetters }: ActionContext<ProjectsViewPeopleState, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {}
      commit('fetching', true)
      $axios.get(`/projects/${rootGetters.routeParams.id}/members`, {
        params: query
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }

        commit('items', response.data?.meta?.count || 0)
        commit('items', response.data?.data || [])

        resolve()
      }).finally(() => (commit('fetching', false)))
    })
  }
}

export default actions
