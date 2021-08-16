import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  process_loading (state: State) { return state.process_loading },
  total (state: State) { return state.total },
  items (state: State) { return state.items },
  selected (state: State) { return state.selected }
}

export default getters
