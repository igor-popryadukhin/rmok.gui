import { RootState } from '@/store'
import { SessionsState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<SessionsState, RootState> = {
  items (state: SessionsState) { return state.items }
}

export default getters
