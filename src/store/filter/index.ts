import { RootStateInterface } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state, { FilterStateInterface } from './state'

const filter: Module<FilterStateInterface, RootStateInterface> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default filter
