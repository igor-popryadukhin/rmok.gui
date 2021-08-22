import { RootState } from '@/store'
import { ProfileState } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<ProfileState, RootState> = {
  profile (state: ProfileState): ProfileState { return Object.assign({}, state) },
  profile_tz (state: ProfileState) { return state.tz }
}

export default getters
