import { PBXConfigState, ProfileState } from '@/store/profile/pbxConfig/state'

import { GetterTree } from 'vuex'

const getters: GetterTree<PBXConfigState, ProfileState> = {
  login (state): PBXConfigState { return state.login },
  password (state): PBXConfigState { return state.password },
  port (state): PBXConfigState { return state.port },
  server (state): PBXConfigState { return state.server },
  display_name (state): PBXConfigState { return state.display_name }
}

export default getters
