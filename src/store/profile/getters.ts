import { RootState } from '@/store'
import { ProfileState } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<ProfileState, RootState> = {
  profile (state: ProfileState): ProfileState { return Object.assign({}, state) },
  first_name (state: ProfileState) { return state.first_name },
  last_name (state: ProfileState) { return state.last_name },
  middle_name (state: ProfileState) { return state.middle_name },
  login (state: ProfileState) { return state.login },
  email (state: ProfileState) { return state.email },
  profile_tz (state: ProfileState) { return state.tz }
}

export default getters
