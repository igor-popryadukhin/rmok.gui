import { State } from './state'
import { GetterTree } from 'vuex'
import { RootState } from '@/store'

const getters: GetterTree<State, RootState> = {
  id (state: State) { return state?.id || 0 },
  name (state: State) { return state?.name || '' },
  permissions (state: State) { return state?.permissions || [] }
}

export default getters
