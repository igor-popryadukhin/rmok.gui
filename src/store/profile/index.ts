import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ProfileState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const profile: Module<ProfileState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}

export default profile
