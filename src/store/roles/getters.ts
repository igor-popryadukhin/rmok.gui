import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  items_offset (state: State) { return state.items_offset },
  items_count (state: State) { return state.items_count },
  items (state: State) { return state.items }
}

export default getters
