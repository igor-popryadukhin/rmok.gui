import { TasksState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<TasksState> = {
  pending_count (state, payload: number) {
    state.pending_count = payload
  }
}

export default mutations
