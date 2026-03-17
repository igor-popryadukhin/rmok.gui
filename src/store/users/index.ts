import { RootState } from '@/store';
import { Module } from 'vuex';
import state, { State } from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import list from './list';
import view from './view';
import create from './create';

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    create,
    list,
    view
  }
};

export default module;
