import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  status (state: State) { return state.status }
}

export default getters
