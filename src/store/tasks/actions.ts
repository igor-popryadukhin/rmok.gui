import { $axios } from '@/plugins/axios';
import { RootState } from '@/store';
import { ActionTree } from 'vuex';
import { TasksState } from './state';

const actions: ActionTree<TasksState, RootState> = {
  calculate: ({ commit }, payload) => {
    $axios.post('/tasks/count/calculate', payload)
      .then((response) => {
        commit('pending_items', response.data || []);
      });
  }
};

export default actions;
