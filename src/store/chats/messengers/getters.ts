import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'


const getters: GetterTree<State, RootState> = {
  fetching (state: State) { return state.fetching },
  items (state: State) { return state.items }
}

export default getters
