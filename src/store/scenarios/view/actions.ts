import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import Scenarios from '@/api/Scenarios'

export const actions: ActionTree<State, RootState> = {

  /**
   * Детальная информация о сценарий
   *
   * @param ctx
   * @param id
   */
  fetch (ctx: ActionContext<State, RootState>, id) {
    return new Scenarios()
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
    const data: Record<string, unknown> = {
      name: ctx.state.name,
      scenario: ctx.state.scenario
    }
    return new Scenarios().edit(ctx.state.id, data)
  },

  /**
   * Удаляет сценарий
   *
   * @param ctx
   */
  delete (ctx: ActionContext<State, RootState>) {
    return new Scenarios().delete(ctx.state.id)
  }
}
