import { GetterTree } from 'vuex'
import { RootState } from '@/store'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  history_offset (state: State) { return state.history_offset },
  total (state: State) { return state.total },
  history (state: State) { return state.history }
}

export default getters
