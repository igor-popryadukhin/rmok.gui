import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { State } from './state'

export const transfer_dialog : Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}
