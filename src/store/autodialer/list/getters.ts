import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  items (state: State) { return state.items },
  total (state: State) { return state.total }
}

export default getters
