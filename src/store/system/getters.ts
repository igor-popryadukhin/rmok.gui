import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  notifications (state) { return state.notifications },
  notifications_count (state) { return state.notifications_count }
}

export default getters
