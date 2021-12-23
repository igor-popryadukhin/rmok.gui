import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  items (state: State) { return state.items },
  total (state: State) { return state.total },
  per_page (state: State) { return state.per_page },
  filter_offset (state: State) { return state.filter_offset || 0 }
}

export default getters
