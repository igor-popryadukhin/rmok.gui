import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsListState } from './state'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactsListState, RootState> = {
  fetch: ({ commit, state, getters }: ActionContext<ContactsListState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      const query: Record<string, string|number|Array<string|number>|boolean> = getters['filter/all']

      query.count = state.per_page
      query.is_open = true

      const cancelTokenSource = axios.CancelToken.source()
      cancelTokenSources.push(cancelTokenSource)

      setTimeout(() => (commit('loading', true)), 0)

      $axios.get('/contacts', {
        params: query,
        cancelToken: cancelTokenSource.token
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('items', response.data?.data || [])
          commit('items_total', response.data?.meta?.count || 0)
          resolve()
        }
      }).catch(reject).finally(() => (commit('loading', false)))
    })
  },

  /**
   * Отменяет загрузку контактов
   */
  cancelFetch: () => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }
  },

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
