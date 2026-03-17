import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { State } from './state';
import { $axios } from '@/plugins/axios';
import APIError from '@/api/classes/APIError';
import {AxiosResponse} from "axios";

const actions: ActionTree<State, RootState> = {
  /**
   * Получаем доступные мессенджеры из справочника
   *
   * @param commit
   * @param rootGetters
   */
  fetch ({ commit, rootGetters }) {
    return new Promise<void>((resolve, reject) => {
      commit('fetching', true);
      $axios
        .get(`/integrations/messengers`)
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data);
          }
          commit('items', response.data);
          resolve();
        }).catch(reject)
        .finally(() => (commit('fetching', false)));
    });
  }
};

export default actions;
