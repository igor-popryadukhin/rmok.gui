import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  status (state: State) { return state.status },
  call_back_in_minutes (state: State) { return state.call_back_in_minutes },
  count_of_call_lines (state: State) { return state.count_of_call_lines }
}

export default getters
