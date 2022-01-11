import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { ProjectsViewState } from './state'

const actions: ActionTree<ProjectsViewState, RootState> = {
  fetch: ({ commit, rootGetters }) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {}
      commit('flush')
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
        commit('project_statuses', response.data?.statuses || [])

        resolve()
      }).finally(() => (commit('fetching', false)))
    })
  },

  /**
   * Промывка состояние
   * @param commit
   */
  flush: ({ commit }) => {
    commit('flush')
    commit('people/flush')
  }
}

export default actions
