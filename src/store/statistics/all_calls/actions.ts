import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import APIError from '@/api/classes/APIError'

let cancelFetchHistory: CancelTokenSource|null = null

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] }

      if (cancelFetchHistory) {
        cancelFetchHistory.cancel()
        cancelFetchHistory = null
      }

      cancelFetchHistory = axios.CancelToken.source()

      setTimeout(() => (commit('history_fetching', true)), 0)
      $axios.get('/statistics/all-calls', {
        params: query,
        cancelToken: cancelFetchHistory.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        commit('history', response.data?.data || [])
        commit('history_count', response.data?.meta?.count || 0)
        resolve(response.data)
      }).finally(() => (commit('history_fetching', false)))
    })
  },

  cancel_fetch_all () {
    if (cancelFetchHistory) {
      cancelFetchHistory.cancel()
      cancelFetchHistory = null
    }
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
