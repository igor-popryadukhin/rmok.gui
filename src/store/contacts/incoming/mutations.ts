import { ContactsIncomingState, contactsIncomingState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ContactsIncomingState> = {
  fetching (state, payload) { state.fetching = payload },

  contact_id (state, payload) { state.contact_id = payload },
  contact_name (state, payload) { state.contact_name = payload },
  contact_city (state, payload) { state.contact_city = payload },
  contact_region (state, payload) { state.contact_region = payload },
  contact_tz (state, payload) { state.contact_tz = payload },
  contact_created_at (state, payload) { state.contact_created_at = payload },

  /** Сброс состояния */
  flush (state) {
    Object.assign(state, contactsIncomingState())
  }
}

export default mutations
