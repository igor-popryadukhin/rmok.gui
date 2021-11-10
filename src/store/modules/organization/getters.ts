import { GetterTree } from 'vuex'
import { State } from './state'
import { RootState } from '@/store'

const getters: GetterTree<State, RootState> = {
  id (state) { return state.id },
  name (state) { return state.name }
}

export default getters
