import { RootState } from '@/store';
import { Module } from 'vuex';
import state, { ContactsIncomingState } from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const module: Module<ContactsIncomingState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};

export default module;
