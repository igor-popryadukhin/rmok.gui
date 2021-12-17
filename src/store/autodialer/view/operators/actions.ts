import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import APIError from '@/api/classes/APIError'
import { deleteObjectFromArray } from '@/utils/utils'

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param id
   */
  fetch (ctx: ActionContext<State, RootState>, id: number) {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/autodialer/${id}/operators`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          } else {
            ctx.commit('items', response.data?.data || [])
            resolve()
          }
        }).catch(reject)
    })
  },

  exclude (ctx: ActionContext<State, RootState>, payload: number|number[]) {
    const autodialerId = ctx.rootGetters['autodialer/view/id']
    let userIds = []

    if (Array.isArray(payload)) { userIds = payload } else { userIds = [payload] }

    return new Promise<void>((resolve, reject) => {
      $axios
        .get(`/autodialer/${autodialerId}/operators/exclude`, {
          params: {
            user_ids: userIds
          }
        }).then((response: AxiosResponse) => {
          if (![200, 204].includes(response.status)) {
            throw new APIError(response.data)
          } else {
            const items = ctx.state.items.map((value) => value)

            userIds.forEach((id) => {
              deleteObjectFromArray(items, 'operator_id', id)
            })

            ctx.commit('items', items)

            resolve()
          }
        }).catch(reject)
    })
  }

}

export default actions
