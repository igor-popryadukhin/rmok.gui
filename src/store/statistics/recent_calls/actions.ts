import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { $axios } from '@/plugins/axios';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import APIError from '@/api/classes/APIError';

let cancelFetchPie: CancelTokenSource|null = null;
let cancelFetchHistory: CancelTokenSource|null = null;
let cancelFetchTotalCalls: CancelTokenSource|null = null;

const actions: ActionTree<State, RootState> = {
  fetch_pie: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] };

      if ('offset' in query) { delete query.offset; }
      if ('count' in query) { delete query.count; }
      if ('order_by' in query) { delete query.order_by; }
      if ('order_direction' in query) { delete query.order_direction; }

      if (cancelFetchPie) {
        cancelFetchPie.cancel();
        cancelFetchPie = null;
      }

      cancelFetchPie = axios.CancelToken.source();

      setTimeout(() => (commit('pie_fetching', true)), 0);
      $axios.get('/statistics/recent-calls/pie', {
        params: query,
        cancelToken: cancelFetchPie.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }
        commit('pie_labels', response.data?.labels || []);
        commit('pie_colors', response.data?.colors || []);
        commit('pie_series', response.data?.series || []);
        resolve(response.data);
      }).finally(() => (commit('pie_fetching', false)));
    });
  },

  fetch_history: ({ commit, getters }: ActionContext<State, RootState>) => {
    return new Promise<void>((resolve) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] };

      if (cancelFetchHistory) {
        cancelFetchHistory.cancel();
        cancelFetchHistory = null;
      }

      cancelFetchHistory = axios.CancelToken.source();

      setTimeout(() => (commit('history_fetching', true)), 0);
      $axios.get('/statistics/recent-calls/history', {
        params: query,
        cancelToken: cancelFetchHistory.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }
        commit('history', response.data?.data || []);
        commit('history_count', response.data?.meta?.count || 0);
        resolve(response.data);
      }).finally(() => (commit('history_fetching', false)));
    });
  },

  fetch_total_calls: ({ commit, getters }) => {
    return new Promise<void>((resolve, reject) => {
      const query: Record<string, unknown> = { ...getters['filter/all'] };

      if ('offset' in query) { delete query.offset; }
      if ('count' in query) { delete query.count; }
      if ('order_by' in query) { delete query.order_by; }
      if ('order_direction' in query) { delete query.order_direction; }

      if (cancelFetchTotalCalls) {
        cancelFetchTotalCalls.cancel();
        cancelFetchTotalCalls = null;
      }

      cancelFetchTotalCalls = axios.CancelToken.source();

      setTimeout(() => (commit('total_calls_fetching', true)), 0);
      $axios.get('/statistics/recent-calls/total-calls', {
        params: { ...query },
        cancelToken: cancelFetchTotalCalls.token
      }).then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }

        commit('total_calls', response.data?.count || 0);
        resolve();
      }).catch(reject).finally(() => (commit('total_calls_fetching', false)));
    });
  },

  cancel_fetch_all () {
    if (cancelFetchPie) {
      cancelFetchPie.cancel();
      cancelFetchPie = null;
    }

    if (cancelFetchHistory) {
      cancelFetchHistory.cancel();
      cancelFetchHistory = null;
    }

    if (cancelFetchTotalCalls) {
      cancelFetchTotalCalls.cancel();
      cancelFetchTotalCalls = null;
    }
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
