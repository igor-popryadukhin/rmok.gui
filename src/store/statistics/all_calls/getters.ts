import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  history_fetching (state: State) { return state.history_fetching },
  history (state: State) { return state.history },
  history_count (state: State) { return state.history_count }
}

export default getters
