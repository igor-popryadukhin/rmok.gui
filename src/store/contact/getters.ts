import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  first_name (state: State) { return state.first_name },
  last_name (state: State) { return state.last_name },
  middle_name (state: State) { return state.middle_name },
  contact_name (state: State) { return state.contact_name },
  city (state: State) { return state.city },
  region (state: State) { return state.region },
  address (state: State) { return state.address },
  tz (state: State) { return state.tz || 'Europe/Moscow' },
  emails (state: State) { return state.emails },
  phones (state: State) { return state.phones },
  tags (state: State) { return state.tags },
  owner (state: State) { return state.owner },
  project (state: State) { return state.project },
  notes (state: State) { return state.notes },
  default_phone (state: State) { return state.default_phone },
  created_at (state: State) { return state.created_at }
}

export default getters
