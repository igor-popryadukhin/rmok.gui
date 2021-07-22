import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { ProjectState } from './state'

const project: Module<ProjectState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default project
