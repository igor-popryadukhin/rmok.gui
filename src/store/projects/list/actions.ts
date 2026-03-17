import { $axios } from '@/plugins/axios';
import { RootState } from '@/store';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { ActionContext, ActionTree } from 'vuex';
import { ProjectsListState } from './state';

const cancelTokenSources: CancelTokenSource[] = [];

const actions: ActionTree<ProjectsListState, RootState> = {
  fetch: ({ commit }: ActionContext<ProjectsListState, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, Record<string, unknown>> = {};

      const cancelTokenSource = axios.CancelToken.source();
      cancelTokenSources.push(cancelTokenSource);

      commit('items_fetching', true);
      $axios.get('/projects', {
        params: query,
        cancelToken: cancelTokenSource.token
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          commit('total', response.data?.meta?.count || 0);
          commit('items', response.data?.data || []);
          resolve();
        }
      }).finally(() => (commit('items_fetching', false)));
    });
  },

  fetch_cancel: () => {
    const len = cancelTokenSources.length;
    for (let i = 0; i < len; i++) {
      cancelTokenSources.pop()?.cancel();
    }
  },

  flush: ({ commit }: ActionContext<ProjectsListState, RootState>) => {
    commit('flush');
  }
};

export default actions;
