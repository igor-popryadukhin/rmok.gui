import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import params from './params'
import list from './list'
import create from './create'
import { transfer_dialog } from './transfer_dialog'

const module: Module<ContactsState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    params,
    list,
    transfer_dialog,
    create
  }
}

export default module
