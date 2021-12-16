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
  fetch (ctx: ActionContext<State, RootState>, id: number) {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/autodialer/params/${id}/calls`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            ctx.commit('items', response.data?.data || [])
            resolve()
          }
        }).catch(reject)
    })
  }

}

export default actions
