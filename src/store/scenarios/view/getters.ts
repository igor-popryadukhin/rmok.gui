import { RootState } from '@/store'
import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, RootState> = {
  id (state: State) { return state.id },
  name (state: State) { return state.name },
  scenario (state: State) { return state.scenario }
}
