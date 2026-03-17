import APIError from '@/api/classes/APIError';
import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { ContactsViewMessagesState } from './state';
import { AxiosResponse } from 'axios';
import { $axios } from '@/plugins/axios';

const actions: ActionTree<ContactsViewMessagesState, RootState> = {
  fetch: ({ commit }, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      commit('items_fetching', true);

      $axios.get('/chat/messages', { params })
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data);
          }

          commit('items', response.data || []);

          resolve();
        }).catch(reject).finally(() => (commit('items_fetching', false)));
    });
  },

  flush: ({ commit }) => {
    commit('flush');
  }
};

export default actions;
