import { RootState } from '@/store'
import view from './view'
import list from './list'
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
  state,
  modules: {
    list,
    view
  }
}

export default project
