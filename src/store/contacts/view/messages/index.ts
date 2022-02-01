import { RootState } from '@/store'
import { Module } from 'vuex'
import state, { ContactsViewMessagesState } from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const module: Module<ContactsViewMessagesState, RootState> = {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
}

export default module
