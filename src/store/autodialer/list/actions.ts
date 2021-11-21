import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import AutodialerParams from '@/api/AutodialerParams'

const actions: ActionTree<State, RootState> = {

  /**
   * Пучить элементы обзвона.
   *
   * @param ctx
   * @param payload
   */
  fetch (ctx: ActionContext<State, RootState>, payload = {}) {
    return new AutodialerParams()
      .get(Object.assign({ count: 50 }, payload))
      .then((response) => {
        ctx.commit('total', +response.meta?.count || 0)
        ctx.commit('items', response.data)
      })
  },

  /**
   * Очистить состояние текущего модуля.
   *
   * @param ctx
   */
  clear (ctx: ActionContext<State, RootState>) {
    ctx.commit('items', [])
  }

}

export default actions
