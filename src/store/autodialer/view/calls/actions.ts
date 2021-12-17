import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param id
   */
  fetch: ({ commit, rootGetters }, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      const id = rootGetters.routeParams.id
      $axios.get(`/autodialer/params/${id}/calls`, { params })
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
  }

}

export default actions
