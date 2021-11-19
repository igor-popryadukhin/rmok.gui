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
  fetch (ctx: ActionContext<State, RootState>, payload = {}): void {
    ctx.commit('fetch_process', true)

    const params: Record<string, string | number> = {}

    if (ctx.state.filter_offset) {
      params.offset = ctx.state.filter_offset
    }

    new AutodialerParams()
      .get(Object.assign({ count: 50 }, params, payload))
      .then((response) => {
        ctx.commit('total', +response.meta?.count || 0)
        ctx.commit('params', response.data)
      }).finally(() => (ctx.commit('fetch_process', false)))
  },

  /**
   * Очистить состояние текущего модуля.
   *
   * @param ctx
   */
  clear (ctx: ActionContext<State, RootState>) {
    ctx.commit('params', [])
  }

}

export default actions
