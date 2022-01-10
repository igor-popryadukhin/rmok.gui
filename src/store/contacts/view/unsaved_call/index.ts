import { RootState } from '@/store'
import { Module } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import unsavedCallState, { UnsavedCallState } from './state'

/*
    Не завершённые действия с контактом после звонка
 */

const module: Module<UnsavedCallState, RootState> = {
  namespaced: true,
  state: unsavedCallState,
  actions,
  getters,
  mutations
}

export default module
