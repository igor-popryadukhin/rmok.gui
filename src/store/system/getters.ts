import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  notifications_visible (state: State) { return state.notifications_visible },
  notifications (state: State) { return state.notifications },
  notifications_count (state: State) { return state.notifications_count }
}

export default getters
