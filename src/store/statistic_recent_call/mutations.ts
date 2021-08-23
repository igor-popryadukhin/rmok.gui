import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  process_loading (state: State, payload) { state.process_loading = payload },
  total_calls (state: State, payload) { state.total_calls = payload },
  client_calls (state: State, payload) { state.client_calls = payload },
  history_offset (state: State, payload) { state.history_offset = payload },
  history (state: State, payload) { state.history = payload }
}

export default mutations
