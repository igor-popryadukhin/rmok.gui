import { GetterTree } from 'vuex'
import { RootState } from '@/store'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  activity (state: State) { return state.activity },
  types (state: State) { return state.types }
}

export default getters
