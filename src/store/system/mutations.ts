import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  notifications (state, payload) { state.notifications = payload },
  notifications_count (state, payload) { state.notifications_count = payload }
}

export default mutations
