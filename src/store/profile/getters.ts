import { RootState } from '@/store'
import { ProfileState } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<ProfileState, RootState> = {
  profile (state): ProfileState { return state },
  pbx_config (state): ProfileState { return state.pb_config }
}

export default getters
