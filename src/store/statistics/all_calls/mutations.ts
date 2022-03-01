import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  history_fetching (state: State, payload) { state.history_fetching = payload },
  history (state: State, payload) { state.history = payload },
  history_count (state: State, payload) { state.history_count = payload },

  flush (state: State) { Object.assign(state, defaultState()) }
}

export default mutations
