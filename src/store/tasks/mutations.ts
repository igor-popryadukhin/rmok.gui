import { TasksState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<TasksState> = {
  pending_items (state, payload) { state.pending_items = payload }
}

export default mutations
