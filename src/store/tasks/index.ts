import { RootState } from '@/store';
import { Module } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state, { TasksState } from './state';

const index: Module<TasksState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};

export default index;
