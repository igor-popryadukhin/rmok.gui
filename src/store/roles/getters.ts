import { RootState } from '@/store'
import { RolesState } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<RolesState, RootState> = {
  items_offset (state: RolesState) { return state.items_offset },
  items_count (state: RolesState) { return state.items_count },
  items (state: RolesState) { return state.items },
  items_fetching (state: RolesState) { return state.items_fetching }
}

export default getters
