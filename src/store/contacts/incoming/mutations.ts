import { ContactsIncomingState, contactsIncomingState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ContactsIncomingState> = {
  fetching (state, payload) { state.fetching = payload; },

  contact_id (state, payload) { state.contact_id = payload; },
  contact_name (state, payload) { state.contact_name = payload; },
  contact_first_name (state, payload) { state.contact_first_name = payload; },
  contact_last_name (state, payload) { state.contact_last_name = payload; },
  contact_middle_name (state, payload) { state.contact_middle_name = payload; },
  contact_tags (state, payload) { state.contact_tags = payload; },
  contact_owner_id (state, payload) { state.contact_owner_id = payload; },
  contact_owner_full_name (state, payload) { state.contact_owner_full_name = payload; },
  contact_project_id (state, payload) { state.contact_project_id = payload; },
  contact_project_name (state, payload) { state.contact_project_name = payload; },
  contact_project_statuses (state, payload) { state.contact_project_statuses = payload; },
  contact_project_scenario (state, payload) { state.contact_project_scenario = payload; },
  contact_details (state, payload) { state.contact_details = payload; },
  contact_details_default (state, payload) { state.contact_details_default = payload; },
  contact_city (state, payload) { state.contact_city = payload; },
  contact_region (state, payload) { state.contact_region = payload; },
  contact_tz (state, payload) { state.contact_tz = payload; },
  contact_created_at (state, payload) { state.contact_created_at = payload; },
  messenger_available (state, payload) { state.messenger_available = payload; },
  messenger (state, payload) { state.messenger = payload; },

  /** Сброс состояния */
  flush (state) {
    Object.assign(state, contactsIncomingState());
  }
};

export default mutations;
