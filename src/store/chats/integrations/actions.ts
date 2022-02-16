import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import APIError from '@/api/classes/APIError'
import {AxiosResponse} from "axios";

const actions: ActionTree<State, RootState> = {
  /**
   *
   * @param commit
   * @param payload
   */
  fetch_params: ({ commit }, payload) => {
    return new Promise<number>((resolve, reject) => {
      commit('fetching', true)

      $axios.get(`/integrations/${payload}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('account_phone', response.data?.account_phone || null)
          commit('api_id', response.data?.api_id || null)
          commit('api_hash', response.data?.api_hash || null)
          commit('messenger', response.data?.messenger || null)


        }).catch(reject).finally(() => (commit('fetching', false)))
    })
  }
}

export default actions
