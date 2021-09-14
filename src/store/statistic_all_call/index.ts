import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { State } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import statistic_filter from '../statistic_filter'

const module: Module<State, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    filter: statistic_filter
  }
}

export default module
