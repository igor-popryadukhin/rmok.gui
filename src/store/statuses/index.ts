import { RootState } from '@/store';
import { Module } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import state, { StatusesState } from './state';

const module: Module<StatusesState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};

export default module;
