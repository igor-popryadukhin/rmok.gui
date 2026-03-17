import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios';
import { RootState } from '@/store';
import { AxiosResponse } from 'axios';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';

const actions: ActionTree<State, RootState> = {

  /**
   * Пучить элементы обзвона.
   *
   * @param ctx
   * @param payload
   */
  fetch ({ commit, getters }, payload = null) {
    const append = !!payload?.append;
    const offset = 30;

    if (append) {
      commit('filter/filter_offset', getters['filter/filter_offset'] + offset);
      if (getters['filter/filter_offset'] > getters['total']) {
        commit('filter/filter_offset', getters['total']);
      }
    } else {
      commit('filter/filter_offset', 0);
    }

    commit('items_fetching', true);

    return new Promise<void>((resolve) => {
      $axios.get('/auto-dialers', {
        params: {
          count: 30,
          ...getters['filter/all']
        }
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }

        interface R {
          id: number;
        }

        const response_items: R[] = response.data?.data || [] as R[];
        const old_items: R[] = getters.items as R[];
        const new_items: R[] = [];

        if (append) {
          response_items.forEach((ni) => {
            if (old_items.findIndex((oi) => oi.id === ni.id) === -1) {
              new_items.push(ni);
            }
          });

          commit('items', old_items.concat(new_items));
        } else {
          commit('items', response_items);
        }

        commit('total', +response.data.meta?.count || 0);

        resolve();
      }).finally(() => (commit('items_fetching', false)));
    });
  },

  /**
   * Очистить состояние текущего модуля.
   *
   * @param ctx
   */
  clear (ctx: ActionContext<State, RootState>) {
    ctx.commit('items', []);
  }

};

export default actions;
