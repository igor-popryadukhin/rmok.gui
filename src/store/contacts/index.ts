import { RootState } from '@/store';
import { Module } from 'vuex';
import state, { ContactsState } from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import contacts_all from './contacts_all';
import contacts_new from './contacts_new';
import create from './create';
import view from './view';
import incoming from './incoming';
import { transfer_dialog } from './transfer_dialog';
import list_in_works from './list_in_works';

const module: Module<ContactsState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    contacts_all,
    contacts_new,
    view,
    incoming,
    transfer_dialog,
    create,
    list_in_works
  }
};

export default module;
