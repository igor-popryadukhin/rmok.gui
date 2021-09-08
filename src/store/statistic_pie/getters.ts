import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  process_loading (state: State) { return state.process_loading },
  series (state: State) { return state.series },
  labels (state: State) { return state.labels },
  colors (state: State) { return state.colors }
}

export default getters
