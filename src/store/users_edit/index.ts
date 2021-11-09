import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import pbx_configuration from '../pbx_configuration'

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    pbx_configuration
  }
}

export default module
