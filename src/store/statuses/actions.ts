import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { StatusesState } from './state'

const actions: ActionTree<StatusesState, RootState> = {
  fetch: ({ commit, state }, params = {}) => {
    return new Promise<void>((resolve) => {
      commit('items_fetching', true)
      $axios.get('/statuses', {
        params
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data)
        }
        const itemsCopy = state.items.map((value) => ({ ...value }))
        response.data.forEach((value) => {
          if (itemsCopy.findIndex((e) => e.id === value.id) === -1) {
            itemsCopy.push(value)
          }
        })
        commit('items', itemsCopy)
        resolve()
      }).finally(() => (commit('items_fetching', false)))
    })
  }
}

export default actions
