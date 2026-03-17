import { RootState } from '@/store';
import { Module } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import settings from './settings';
import state, { State } from './state';
import filter from './filter';

const all_calls: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    filter,
    settings
  }
};

export default all_calls;
