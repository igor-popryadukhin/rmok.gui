import { ContactsViewSettingsState, contactsViewSettingsState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ContactsViewSettingsState> = {
  left_width (state, payload) { state.left_width = payload },
  right_width (state, payload) { state.right_width = payload },

  /** Сброс состояния */
  resetState (state) {
    Object.assign(state, contactsViewSettingsState())
  }
}

export default mutations
