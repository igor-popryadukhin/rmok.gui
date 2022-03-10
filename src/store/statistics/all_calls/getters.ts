import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  items_fetching (state: State) { return state.items_fetching },
  items (state: State) { return state.items },
  items_count (state: State) { return state.items_count }
}

export default getters
