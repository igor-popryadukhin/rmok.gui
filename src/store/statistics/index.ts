import { RootState } from '@/store';
import { Module } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import { State, state } from './state';
import { recent_calls } from './recent_calls';
import calls_count from './calls_count';
import all_calls from './all_calls';
import manager_employment from './manager_employment';

export const statistics: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    manager_employment,
    recent_calls,
    all_calls,
    calls_count
  }
};
