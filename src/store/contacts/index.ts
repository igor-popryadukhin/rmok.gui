import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import params from './params'

const module: Module<ContactsState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    params
  }
}

export default module
