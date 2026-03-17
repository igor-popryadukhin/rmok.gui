import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import Scenarios from '@/api/Scenarios';

const actions: ActionTree<State, RootState> = {

  /**
   * Получить сценарий.
   *
   * @param ctx
   * @param params
   */
  fetch (ctx: ActionContext<State, RootState>, params = {}) {
    return new Scenarios()
      .get(params)
      .then((response) => {
        ctx.commit('total', +response.meta?.count || 0);
        ctx.commit('items', response.data);
      });
  }
};

export default actions;
