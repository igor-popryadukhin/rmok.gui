import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsViewHistoryState } from './state'
import { AxiosResponse, CancelTokenSource } from 'axios'
import { $axios } from '@/plugins/axios'

const cancelTokenSources: CancelTokenSource[] = []

const actions: ActionTree<ContactsViewHistoryState, RootState> = {
  fetch: ({ commit, rootGetters }: ActionContext<ContactsViewHistoryState, RootState>) => {
    const len = cancelTokenSources.length
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel()
    }

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => (commit('items_fetching', true)), 0)

      $axios.get(`/contacts/${rootGetters.routeParams.contact_id}/history`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new Error(response.statusText)
          }

          commit('items_count', response.data?.meta?.count || 0)
          commit('items', response.data?.data || [])

          resolve()
        }).catch(reject).finally(() => (commit('items_fetching', false)))
    })
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
