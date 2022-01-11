import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  fetching (state: State) { return state.fetching },

  role_name (state: State) { return state.role_name },
  role_permissions (state: State) { return state.role_permissions }
}

export default getters
