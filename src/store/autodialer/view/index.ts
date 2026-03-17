import { RootState } from '@/store';
import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { operators } from './operators';
import calls from './calls';
import journal from './journal';
import stats_online from './stats_online';
import state, { State } from './state';

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    calls,
    operators,
    journal,
    stats_online
  }
};

export default module;
