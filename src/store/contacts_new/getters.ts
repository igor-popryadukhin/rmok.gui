import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  process_loading (state) { return state.process_loading },
  total (state) { return state.total },
  offset (state) { return state.offset },
  items (state) { return state.items },
  more_available (state) { return state.more_available }
}

export default getters
