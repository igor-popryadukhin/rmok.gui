import { RootState } from '@/store';
import { Module } from 'vuex';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import state, { SettingsStateInterface } from './state';

const settings: Module<SettingsStateInterface, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};

export default settings;
