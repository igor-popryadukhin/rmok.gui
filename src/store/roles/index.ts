import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { RolesState } from './state'
import { edit } from './edit'

export const roles: Module<RolesState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    edit
  }
}
