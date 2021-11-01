import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

const getters: GetterTree<State, RootState> = {
  fetch_process (state: State) { return state.fetch_process },
  params (state: State) { return state.params }
}

export default getters
