import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  permissions (state: State) { return state.permissions }
}

export default getters
