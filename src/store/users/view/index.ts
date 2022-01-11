import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { UsersViewState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import sessions from './sessions'

const module: Module<UsersViewState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    sessions
  }
}

export default module
