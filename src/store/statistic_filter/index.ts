import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import state, { State } from './state'

const module: Module<State, RootState> = {
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
