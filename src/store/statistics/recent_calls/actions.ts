import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import Statistics from '@/api/Statistics'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {
  fetch_pie: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const request: Record<string, any> = { ...getters['filter/all'] }

      if ('offset' in request) { delete request.offset }
      if ('count' in request) { delete request.count }
      if ('order_by' in request) { delete request.order_by }
      if ('order_direction' in request) { delete request.order_direction }

      commit('pie_fetching', true)
      $axios.get('/statistics/recent-calls/pie', {
        params: request
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        commit('pie_labels', response.data?.labels || [])
        commit('pie_colors', response.data?.colors || [])
        commit('pie_series', response.data?.series || [])
        resolve(response.data)
      }).finally(() => (commit('pie_fetching', false)))
    })
  },

  fetch_history: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const request: Record<string, any> = { ...getters['filter/all'] }

      commit('history_fetching', true)
      $axios.get('/statistics/recent-calls/history', {
        params: request
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        commit('history', response.data?.data || [])
        resolve(response.data)
      }).finally(() => (commit('history_fetching', false)))
    })
  },

  fetchTotalCalls: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .recentCallsTotalCalls(params)
        .then((count) => {
          commit('total_calls', count)
          resolve()
        }).catch(reject)
    })
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
