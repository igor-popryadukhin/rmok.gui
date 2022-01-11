import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { UserListState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const module: Module<UserListState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
