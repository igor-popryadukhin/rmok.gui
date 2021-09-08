import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import params from './params'

const module: Module<State, RootState> = {
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
