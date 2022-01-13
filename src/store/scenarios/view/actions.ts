import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionTree } from 'vuex'
import { ScenarioViewState } from './state'

export const actions: ActionTree<ScenarioViewState, RootState> = {

  /**
   * Детальная информация о сценарий
   *
   * @param ctx
   * @param id
   */
  fetch ({ commit }, id) {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/scenarios/${id}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }
          commit('fill', response.data)
          resolve()
        }).catch(reject)
    })
  }
}
