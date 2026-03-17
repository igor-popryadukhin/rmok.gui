import { RootState } from '@/store';
import settings from './settings';
import { Module } from 'vuex';
import state, { State } from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import filter from './filter';

export const recent_calls: Module<State, RootState> = {
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
