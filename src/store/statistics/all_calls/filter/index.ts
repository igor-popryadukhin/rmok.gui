import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { state, State } from './state'

const module: Module<State, RootState> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
