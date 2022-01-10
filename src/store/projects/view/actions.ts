import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { ProjectsViewState } from './state'

const actions: ActionTree<ProjectsViewState, RootState> = {
  fetch: ({ commit, rootGetters }: ActionContext<ProjectsViewState, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {}
      commit('reset_state')
      commit('fetching', true)
      $axios.get(`/projects/${rootGetters.routeParams.id}`, {
        params: query
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }

        commit('project_name', response.data?.name || '')
        commit('project_description', response.data?.description || '')
        commit('project_scenario', response.data?.scenario || '')

        resolve()
      }).finally(() => (commit('fetching', false)))
    })
  }
}

export default actions
