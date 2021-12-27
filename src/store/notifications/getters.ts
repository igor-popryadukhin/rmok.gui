import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  visible (state: State) { return state.visible },
  count (state: State) { return state.count },
  items (state: State) { return state.items }
}

export default getters
