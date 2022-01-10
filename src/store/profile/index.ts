import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import pbx_configuration from '../pbx_configuration'
import organization from '../modules/organization'
import project from '../modules/project'
import role from '../modules/role'

const profile: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    organization,
    pbx_configuration,
    project,
    role
  }
}

export default profile
