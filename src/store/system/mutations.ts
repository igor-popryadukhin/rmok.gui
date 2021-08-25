import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  notifications_visible (state: State, payload) { state.notifications_visible = payload },
  notifications (state: State, payload) { state.notifications = payload },
  notifications_count (state: State, payload) { state.notifications_count = payload }
}

export default mutations
