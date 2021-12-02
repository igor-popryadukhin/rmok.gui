import { RootState } from '@/store'
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
    filter
  }
}

export default module
