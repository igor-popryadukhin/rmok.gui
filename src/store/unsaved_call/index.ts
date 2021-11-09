import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import data from './data'
import state, { State } from './state'

/*
    Не завершённые действия с контактом после звонка
 */

const module: Module<State, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  modules: {
    data
  }
}

export default module
