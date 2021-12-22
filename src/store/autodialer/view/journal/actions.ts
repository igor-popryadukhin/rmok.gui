import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {

  /**
   * Загружает данные журнала.
   *
   * @param ctx
   */
  fetch (ctx: ActionContext<State, RootState>) {
    return new Promise<void>((resolve) => {
      $axios.get(`/autodialer/${ctx.rootGetters.routeParams.id}/journal`, { params: ctx.getters.filter })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            ctx.commit('items_count', response.data?.meta?.count || 0)
            ctx.commit('items', response.data.data || [])
            resolve()
          }
        })
    })
  }

}

export default actions
