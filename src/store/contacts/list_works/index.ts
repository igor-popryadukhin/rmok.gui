import { RootState } from '@/store'
import settings from './settings'
import { Module } from 'vuex'
import state, { ContactListState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import filter from './filter'

const module: Module<ContactListState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    filter,
    settings
  }
}

export default module
