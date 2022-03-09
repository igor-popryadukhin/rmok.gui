import APIError from '@/api/classes/APIError'
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsListState } from './state'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactsListState, RootState> = {
  fetch: ({ commit, state }: ActionContext<ContactsListState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      const query: Record<string, string|number> = {
        only_new: 'true'
      }

      query.count = state.per_page

      const cancelTokenSource = axios.CancelToken.source()
      cancelTokenSources.push(cancelTokenSource)

      commit('loading', true)

      $axios.get('/contacts', {
        params: query,
        cancelToken: cancelTokenSource.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }

        commit('items', response.data?.data || [])
        commit('items_total', response.data?.meta?.count || 0)
        commit('error', false)
        resolve()
      }).catch((reason: Error) => {
        commit('error', true)
        commit('error_text', 'An error occurred while loading contacts')
        commit('items', [])
        commit('items_total', 0)
        reject(reason)
      }).finally(() => (commit('loading', false)))
    })
  },

  /**
   * Отменяет загрузку контактов
   */
  cancel_fetch: () => {
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
