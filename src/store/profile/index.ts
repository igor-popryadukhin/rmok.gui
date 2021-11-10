import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ProfileState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import pbx_configuration from '../pbx_configuration'
import organization from '../modules/organization'

const profile: Module<ProfileState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    organization,
    pbx_configuration
  }
}

export default profile
