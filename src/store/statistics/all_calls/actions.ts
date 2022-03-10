import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import APIError from '@/api/classes/APIError'

let cancelFetchItems: CancelTokenSource|null = null

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] }

      if (cancelFetchItems) {
        cancelFetchItems.cancel()
        cancelFetchItems = null
      }

      cancelFetchItems = axios.CancelToken.source()

      setTimeout(() => (commit('items_fetching', true)), 0)
      $axios.get('/statistics/all-calls', {
        params: query,
        cancelToken: cancelFetchItems.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        commit('items', response.data?.data || [])
        commit('items_count', response.data?.meta?.count || 0)
        resolve(response.data)
      }).finally(() => (commit('items_fetching', false)))
    })
  },

  cancel_fetch_all () {
    if (cancelFetchItems) {
      cancelFetchItems.cancel()
      cancelFetchItems = null
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
