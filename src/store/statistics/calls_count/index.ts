import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import filter from './filter'
import settings from './settings'

const module: Module<State, RootState> = {
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
