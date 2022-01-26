import { RootState } from '@/store'
import { ContactsIncomingState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<ContactsIncomingState, RootState> = {
  fetching (state) { return state.fetching },

  contact_id (state) { return state.contact_id },
  contact_name (state) { return state.contact_name },
  contact_city (state) { return state.contact_city },
  contact_region (state) { return state.contact_region },
  contact_tz (state) { return state.contact_tz },
  contact_created_at (state) { return state.contact_created_at }
}

export default getters
