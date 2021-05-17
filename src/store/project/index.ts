import { RootStateInterface } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { ProjectStateInterface } from './state'

const project: Module<ProjectStateInterface, RootStateInterface> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default project
