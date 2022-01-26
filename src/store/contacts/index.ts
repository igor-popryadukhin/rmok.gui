import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import list from './list'
import create from './create'
import view from './view'
import incoming from './incoming'
import { transfer_dialog } from './transfer_dialog'

const module: Module<ContactsState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    list,
    view,
    incoming,
    transfer_dialog,
    create
  }
}

export default module
