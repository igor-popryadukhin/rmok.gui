import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { State } from './state';
import { $axios } from '@/plugins/axios';
import APIError from '@/api/classes/APIError';

const actions: ActionTree<State, RootState> = {

  /**
   *
   * @param ctx
   * @param pyload
   */
  fetch: ({ commit, state }, pyload) => {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/auto-dialers/${pyload}/calls`, {
        params: {
          only_callers: 0,
          offset: state.filter_offset,
          count: state.items_per_page
        }
      }).then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        } else {
          commit('items_total', response.data?.meta?.count || 0);
          commit('items', response.data?.data || []);
          resolve();
        }
      }).catch(reject);
    });
  },

  /**
   *
   * @param ctx
   * @param payload
   */
  fetch_callers: ({ commit }, payload) => {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/auto-dialers/${payload}/calls`, {
        params: {
          only_callers: 1,
          count: 50
        }
      }).then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        } else {
          commit('items_callers_total', response.data?.meta?.count || 0);
          commit('items_callers', response.data?.data || []);
          resolve();
        }
      }).catch(reject);
    });
  },

  unselected_all_in_page: ({ commit }) => {
    commit('items_selected', []);
  }

};

export default actions;
