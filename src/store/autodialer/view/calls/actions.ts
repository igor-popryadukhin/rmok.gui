import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param params
   */
  fetch: ({ commit, rootGetters }, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      const id = rootGetters.routeParams.id
      $axios.get(`/auto-dialers/${id}/calls`, { params })
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            commit('total', response.data?.meta?.count || 0)
            commit('items', response.data?.data || [])
            resolve()
          }
        }).catch(reject)
    })
  },

  delete_selected: ({ commit, getters, rootGetters }) => {
    return new Promise<void>((resolve, reject) => {
      const id = rootGetters.routeParams.id
      const ids = getters.items_selected
      $axios.delete(`/auto-dialers/${id}/contacts`, { params: { ids } })
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          commit('items_selected', [])
          resolve()
        }).catch(reject)
    })
  },

  selected_all_in_page: ({ commit, state }) => {
    const itemsSelected: number[] = state.items_selected.map((id: number) => id)
    state.items.forEach((e) => {
      if (!itemsSelected.includes(e.id)) {
        itemsSelected.push(e.id)
      }
    })
    commit('items_selected', itemsSelected)
  },

  unselected_all_in_page: ({ commit }) => {
    commit('items_selected', [])
  }

}

export default actions
