import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ProjectsViewState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const module: Module<ProjectsViewState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
