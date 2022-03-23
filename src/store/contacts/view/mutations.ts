import { ContactsViewState, contactsViewState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ContactsViewState> = {
  fetching (state, payload) { state.fetching = payload },

  contact_id (state, payload) { state.contact_id = payload },
  contact_name (state, payload) { state.contact_name = payload },
  contact_first_name (state, payload) { state.contact_first_name = payload },
  contact_last_name (state, payload) { state.contact_last_name = payload },
  contact_middle_name (state, payload) { state.contact_middle_name = payload },
  contact_tags (state, payload) { state.contact_tags = payload },
  contact_owner_id (state, payload) { state.contact_owner_id = payload },
  contact_owner_full_name (state, payload) { state.contact_owner_full_name = payload },
  contact_project (state, payload) { state.contact_project = payload },
  contact_project_id (state, payload) { state.contact_project_id = payload },
  contact_project_name (state, payload) { state.contact_project_name = payload },
  contact_project_statuses (state, payload) { state.contact_project_statuses = payload },
  contact_project_scenario (state, payload) { state.contact_project_scenario = payload },
  contact_details (state, payload) { state.contact_details = payload },
  contact_details_default (state, payload) { state.contact_details_default = payload },
  contact_tz (state, payload) { state.contact_tz = payload },
  contact_created_at (state, payload) { state.contact_created_at = payload },
  contact_location (state, payload) { state.contact_location = payload },
  contact_allow_call (state, payload) { state.contact_allow_call = payload },
  contact_last_status (state, payload) { state.contact_last_status = payload },
  messenger_available (state, payload) { state.messenger_available = payload },
  messenger (state, payload) { state.messenger = payload },

  /** Сброс состояния */
  flush (state) {
    Object.assign(state, contactsViewState())
  }
}

export default mutations
