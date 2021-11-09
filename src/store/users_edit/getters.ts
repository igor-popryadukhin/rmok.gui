import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  full_name (state: State) { return state.full_name },
  first_name (state: State) { return state.first_name },
  last_name (state: State) { return state.last_name },
  middle_name (state: State) { return state.middle_name },
  group (state: State) { return state.group },
  project (state: State) { return state.project },
  projects (state: State) { return state.projects },
  role (state: State) { return state.role },
  tz (state: State) { return state.tz },
  last_activity_at (state: State) { return state.last_activity_at },
  online (state: State) { return state.online },
  userpic (state: State) { return state.userpic },
  abbreviation (state: State) { return state.abbreviation },
  country (state: State) { return state.country },
  email (state: State) { return state.email },
  login (state: State) { return state.login },
  password (state: State) { return state.password },
  pbx_configuration (state: State) { return state.pbx_configuration },
  roles (state: State) { return state.roles },
  phone (state: State) { return state.phone }
}

export default getters
