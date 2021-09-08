import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import state, { State } from './state'
import actions from './actions'

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
