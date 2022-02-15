import { GetterTree } from 'vuex'
import { RootState } from '@/store'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  items (state: State) { return state.items },
  items_fetching (state: State) { return state.items_fetching }
}

export default getters
