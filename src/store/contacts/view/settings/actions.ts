import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { ContactsViewSettingsState } from './state'

const actions: ActionTree<ContactsViewSettingsState, RootState> = {
  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
