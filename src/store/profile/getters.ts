import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  profile (state: State): State { return Object.assign({}, state) },
  first_name (state: State) { return state.first_name },
  last_name (state: State) { return state.last_name },
  middle_name (state: State) { return state.middle_name },
  login (state: State) { return state.login },
  email (state: State) { return state.email },
  mode (state: State) { return state.mode },
  profile_tz (state: State) { return state.tz },
  permissions (state: State) { return state.permissions }
}

export default getters
