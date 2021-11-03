import { RootState } from '@/store'
import { State } from './state'

import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  all (state: State) { return Object.assign({}, state) }
}

export default getters
