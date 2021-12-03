import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  call_back_in_minutes (state, payload) { state.call_back_in_minutes = payload },
  count_of_call_lines (state, payload) { state.count_of_call_lines = payload },
  mode (state, payload) { state.mode = payload },

  fill (state, payload) {
    state.id = payload.id
    state.name = payload.name
    state.status = payload.status
    state.mode = payload.mode
    state.call_back_in_minutes = payload.call_back_in_minutes
    state.count_of_call_lines = payload.count_of_call_lines
  }
}

export default mutations
