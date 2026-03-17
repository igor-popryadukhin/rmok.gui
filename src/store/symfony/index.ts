import { RootState } from '@/store';
import { Module } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import state, { SymfonyStateInterface } from './state';

const symfony: Module<SymfonyStateInterface, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};

export default symfony;
