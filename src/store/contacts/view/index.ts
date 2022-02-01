import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsViewState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import history from './history'
import settings from './settings'
import tasks from './tasks'
import messages from './messages'
import unsaved_call from './unsaved_call'

const module: Module<ContactsViewState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
  modules: {
    messages,
    history,
    tasks,
    settings,
    unsaved_call
  }
}

export default module
