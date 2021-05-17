import { RootStateInterface } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { TasksStateInterface } from './state'

const tasks: Module<TasksStateInterface, RootStateInterface> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default tasks
