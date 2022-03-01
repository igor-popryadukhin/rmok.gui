import { RootState } from '@/store'
import { ContactsViewState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsViewState, RootState> = {
  fetching (state) { return state.fetching },
  contact_id (state) { return state.contact_id },
  contact_name (state) { return state.contact_name },
  contact_first_name (state) { return state.contact_first_name },
  contact_last_name (state) { return state.contact_last_name },
  contact_middle_name (state) { return state.contact_middle_name },
  contact_tags (state) { return state.contact_tags },
  contact_owner_id (state) { return state.contact_owner_id },
  contact_owner_full_name (state) { return state.contact_owner_full_name },
  contact_project_id (state) { return state.contact_project_id },
  contact_project_name (state) { return state.contact_project_name },
  contact_project_statuses (state) { return state.contact_project_statuses },
  contact_project_scenario (state) { return state.contact_project_scenario },
  contact_details (state) { return state.contact_details },
  contact_details_default (state) { return state.contact_details_default },
  contact_city (state) { return state.contact_city },
  contact_region (state) { return state.contact_region },
  contact_tz (state) { return state.contact_tz },
  contact_created_at (state) { return state.contact_created_at },
  messenger_available (state) { return state.messenger_available },
  messenger (state) { return state.messenger }
}

export default getters
