import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { State, state } from './state'
import { recent_calls } from './recent_calls'

export const statistics: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    recent_calls
  }
}
