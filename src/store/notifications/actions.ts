import { RootState } from '@/store';
import { ActionContext, ActionTree } from 'vuex';
import { State } from './state';
import { $axios } from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import APIError from '@/api/classes/APIError';

const actions: ActionTree<State, RootState> = {
  /**
   * Загрузит список системных уведомлений.
   *
   * @param commit
   * @param payload
   */
  fetch: ({ commit }: ActionContext<State, RootState>, payload = null) => {
    return new Promise<void>((resolve, reject) => {
      $axios.get('/notifications')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data);
          }

          commit('count', response.data?.meta?.count || 0);
          commit('items', response.data?.data || []);
        }).catch(reject);
    });
  },

  close ({ commit, state, dispatch }, id: number) {
    const notifications = state.items.map((e) => e);
    const index = notifications.findIndex((e) => e.id === id);
    if (index > -1) {
      commit('count', state.count - 1);

      notifications.splice(index, 1);
      commit('items', notifications);

      if (notifications.length === 0 && state.count > 0) {
        // Если закрыли все уведомления, но на сервере ест ещё...
        // Загружаю системные уведомления
        setTimeout(() => (dispatch('fetch')), 1000);
      } else if (notifications.length === 0 && state.count === 0) {
        commit('visible', false);
      }

      return new Promise<void>((resolve) => {
        $axios.delete('/notifications/' + id)
          .then((response: AxiosResponse) => {
            if (response.status !== 200) {
              throw new APIError(response.data);
            }

            resolve();
          });
      });
    }
  },

  /**
   * Закроет все открытые системные уведомления.
   *
   * @param commit
   * @param state
   */
  close_all ({ commit }) {
    commit('count', 0);
    commit('items', []);
    commit('visible', false);

    $axios.get('/notifications/close-all');
  }
};

export default actions;
