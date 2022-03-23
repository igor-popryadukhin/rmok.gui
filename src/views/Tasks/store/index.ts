import { RootState } from '@/store'
import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import list from './list'
import mutations from './mutations'
import state, { TasksState } from './state'

export const tasks: Module<TasksState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    list
  }
}
