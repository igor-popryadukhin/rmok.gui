import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import Statistics from '@/api/Statistics';

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .recentCallsHistory(params)
        .then((response) => {
          commit('history', response.data);
          commit('client_calls', response.meta?.count || 0);
          resolve();
        }).catch(reject);
    });
  },

  fetchTotalCalls: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .recentCallsTotalCalls(params)
        .then((count) => {
          commit('total_calls', count);
          resolve();
        }).catch(reject);
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
