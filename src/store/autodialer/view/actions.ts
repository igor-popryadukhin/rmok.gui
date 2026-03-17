import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import AutodialerParams from '@/api/AutodialerParams';

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
        ctx.commit('fill', response);
      });
  },

  /**
   * Сохраняет состояние на сервере.
   *
   * @param ctx
   */
  apply (ctx: ActionContext<State, RootState>) {
    const data: Record<string, unknown> = {
      pickup_timeout: ctx.state.pickup_timeout,
      max_calls_number: ctx.state.max_calls_number,
      mode: ctx.state.mode,
      description: ctx.state.description
    };
    return new AutodialerParams().edit(ctx.state.id, data);
  }

};
