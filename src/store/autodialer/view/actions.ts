import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import AutodialerParams from '@/api/AutodialerParams'

export const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param id
   */
  fetch (ctx: ActionContext<State, RootState>, id) {
    return new AutodialerParams()
      .getById(id)
      .then((response) => {
        ctx.commit('fill', response)
      })
  },

  /**
   * Сохраняет состояние на сервере.
   *
   * @param ctx
   */
  apply (ctx: ActionContext<State, RootState>) {
    const data: Record<string, any> = {
      call_back_in_minutes: ctx.state.call_back_in_minutes,
      count_of_call_lines: ctx.state.count_of_call_lines,
      mode: ctx.state.mode
    }
    return new AutodialerParams().edit(ctx.state.id, data)
  }

}
