import APIError from '@/api/classes/APIError';
import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { ContactsViewState } from './state';
import { AxiosResponse } from 'axios';
import { $axios } from '@/plugins/axios';

const actions: ActionTree<ContactsViewState, RootState> = {
  fetch: ({ commit }, payload) => {
    return new Promise<number>((resolve, reject) => {
      commit('fetching', true);

      $axios.get(`/contacts/${payload}`)
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data);
          }

          commit('contact_id', response.data?.id);
          commit('contact_name', response.data?.contact_name);
          commit('contact_first_name', response.data?.first_name);
          commit('contact_last_name', response.data?.last_name);
          commit('contact_middle_name', response.data?.middle_name);
          commit('contact_tags', response.data?.tags);
          commit('contact_owner_id', response.data?.owner?.id || 0);
          commit('contact_owner_full_name', response.data?.owner?.full_name || '');
          commit('contact_allow_call', response.data?.allow_call || false);
          commit('contact_last_status', response.data?.last_status || null);

          if (response.data?.project?.id) {
            commit('contact_project', response.data?.project || null);
            commit('contact_project_id', response.data?.project?.id || 0);
            commit('contact_project_name', response.data?.project?.name || '');
            commit('contact_project_statuses', response.data?.project?.statuses || []);
            commit('contact_project_scenario', response.data?.project?.scenario || '');
          }

          commit('messenger_available', !!response.data?.messenger_available);
          commit('messenger', response.data?.messenger);

          commit('contact_details', response.data?.contact_details || []);
          commit('contact_details_default', response.data?.contact_details_default || null);
          commit('contact_tz', response.data?.tz || '');
          commit('contact_created_at', response.data?.created_at || '');

          if (response.data?.location) {
            commit('contact_location', response.data?.location);
          }

          resolve(response.data?.id);
        })
        .catch(reject)
        .finally(() => (commit('fetching', false)));
    });
  },

  flush: ({ commit }) => {
    commit('flush');
  }
};

export default actions;
