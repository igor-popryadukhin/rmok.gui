import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import AutodialerParams from '@/api/AutodialerParams';

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param id
   */
  fetch (ctx: ActionContext<State, RootState>, id) {
    return new AutodialerParams()
      .getStatsOnline(id)
      .then((response) => {
        ctx.commit('items', response);
      });
  }

};

export default actions;
