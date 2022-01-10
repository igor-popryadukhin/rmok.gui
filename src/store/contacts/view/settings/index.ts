import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsViewSettingsState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

/**
 * Модуль состояния настройки окна просмотра контакта
 */
const module: Module<ContactsViewSettingsState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
