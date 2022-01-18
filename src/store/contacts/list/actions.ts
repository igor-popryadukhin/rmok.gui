import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactListState } from './state'
import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactListState, RootState> = {
  fetch: ({ commit, state, getters }: ActionContext<ContactListState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      const query: Record<string, string|number|Array<string|number>> = getters['filter/all']

      query.count = state.per_page

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

  add_to_autodialer: ({ state, getters }: ActionContext<ContactListState, RootState>, id: number) => {
    const filter_contacts: Record<string, string|number|Array<string|number>> = getters['filter/all']

    if ('count' in filter_contacts) { delete filter_contacts.count }
    if ('offset' in filter_contacts) { delete filter_contacts.offset }

    if (state.items_selected.length > 0) {
      filter_contacts.ids = state.items_selected
    }

    return new Promise<boolean>((resolve, reject) => {
      $axios.post(`/auto-dialers/${id}/add-contacts`, {
        filter_contacts
      }).then((response: AxiosResponse) => {
        if (response.status !== 202) {
          throw new Error('Ошибка')
        }

        resolve(true)
      }).catch(reject)
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
