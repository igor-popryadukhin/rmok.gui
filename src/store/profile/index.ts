import { RootState } from '@/store'
import pbx_config from './pbxConfig'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { ProfileState } from './state'

const profile: Module<ProfileState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    pbx_config
  }
}

export default profile
