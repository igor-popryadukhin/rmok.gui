import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  fetch_process (state: State) { return state.fetch_process },
  params (state: State) { return state.params },
  total (state: State) { return state.total },
  filter_offset (state) { return state.filter_offset }
}

export default getters
