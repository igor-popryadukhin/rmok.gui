import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ContactsViewTasksState } from './state'
import { AxiosResponse } from 'axios'
import { $axios } from '@/plugins/axios'

const actions: ActionTree<ContactsViewTasksState, RootState> = {
  fetch: ({ commit, rootGetters }: ActionContext<ContactsViewTasksState, RootState>) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => (commit('items_fetching', true)), 0)

      $axios.get('/tasks', { params: { id: rootGetters.routeParams.contact_id } })
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

  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
