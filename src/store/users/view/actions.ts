import APIError from '@/api/classes/APIError';
import { $axios } from '@/plugins/axios';
import { RootState } from '@/store';
import { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';
import { UsersViewState } from './state';

const actions: ActionTree<UsersViewState, RootState> = {
  fetch: ({ commit, rootGetters }) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {};

      commit('flush');
      commit('fetching', true);
      $axios.get(`/users/${rootGetters.routeParams.id}`, {
        params: query
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }

        commit('user_first_name', response.data?.first_name || '');
        commit('user_last_name', response.data?.last_name || '');
        commit('user_middle_name', response.data?.middle_name || '');
        commit('user_login', response.data?.login || '');
        commit('user_groups', response.data?.groups || []);
        commit('user_role', response.data?.role || null);
        commit('user_project', response.data?.project || null);
        commit('user_projects', response.data?.projects || null);
        commit('user_schedule', response.data?.schedule || []);

        if (response.data?.pbx_configuration) {
          if (response.data?.pbx_configuration?.credentials) {
            commit('user_pbx_configuration_credentials', response.data?.pbx_configuration?.credentials);
          }
          if (response.data?.pbx_configuration?.rtc_configuration) {
            commit('user_pbx_configuration_rtc_configuration', response.data?.pbx_configuration?.rtc_configuration);
          }
        }

        resolve();
      }).finally(() => (commit('fetching', false)));
    });
  },

  /**
   * Промывка состояние
   * @param commit
   */
  flush: ({ commit }) => {
    commit('flush');
  }
};

export default actions;
