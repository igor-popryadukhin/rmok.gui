import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { ContactsViewTasksState } from './state';
import { AxiosResponse } from 'axios';
import { $axios } from '@/plugins/axios';

const actions: ActionTree<ContactsViewTasksState, RootState> = {
  fetch: ({ commit }, payload) => {
    return new Promise<void>((resolve, reject) => {
      commit('items_fetching', true);

      $axios.get(`/contacts/${payload}/tasks`, { params: { state: 'pending' } })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }

          commit('items_count', response.data?.meta?.count || 0);
          commit('items', response.data?.data || []);

          resolve();
        }).catch(reject)
        .finally(() => (commit('items_fetching', false)));
    });
  },

  flush: ({ commit }) => {
    commit('flush');
  }
};

export default actions;
