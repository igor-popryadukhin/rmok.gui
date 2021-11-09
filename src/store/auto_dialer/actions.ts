import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import AutodialerParams from '@/api/AutodialerParams'

const actions: ActionTree<State, RootState> = {

  /**
   * Пучить элементы обзвона.
   *
   * @param ctx
   */
  fetch (ctx: ActionContext<State, RootState>): void {
    ctx.commit('fetch_process', true)
    new AutodialerParams()
      .get()
      .then((response) => {
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
