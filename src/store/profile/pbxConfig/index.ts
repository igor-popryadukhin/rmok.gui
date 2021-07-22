import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { PBXConfigState } from './state'

const pbx_config: Module<PBXConfigState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default pbx_config
