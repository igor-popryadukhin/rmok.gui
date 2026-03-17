import { RootState } from '@/store';
import { Module } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import state, { State } from './state';
import filter from './filter';

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    filter
  }
};

export default module;
