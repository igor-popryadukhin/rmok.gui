import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import state, { State } from './state'

/*
    Модуль состояния диалога входящего вызова.
 */

const module: Module<State, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations
}

export default module
