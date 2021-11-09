import { RootState } from '@/store'
import { Module } from 'vuex'
import credentials from './credentials'
import rtc_configuration from './rtc_configuration'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state, { State } from './state'

const module: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    credentials,
    rtc_configuration
  }
}

export default module
