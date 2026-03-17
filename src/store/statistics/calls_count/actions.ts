import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, getters }) => {
    return new Promise<void>((resolve, reject) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] };
      commit('items_fetching', true);
      $axios.get('/statistics/calls-count', {
        params: {
          ...query
        }
      }).then((response: AxiosResponse) => {
        if (![200].includes(response.status)) {
          throw new APIError(response.data);
        }

        commit('items', response.data);

        resolve();
      }).catch(reject).finally(() => (commit('items_fetching', false)));
    });
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  flush: ({ commit }) => {
    commit('flush');
  }
};

export default actions;
