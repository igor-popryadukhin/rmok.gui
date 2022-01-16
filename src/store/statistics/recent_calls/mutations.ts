import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  pie_fetching (state: State, payload) { state.pie_fetching = payload },
  pie_labels (state: State, payload) { state.pie_labels = payload },
  pie_colors (state: State, payload) { state.pie_colors = payload },
  pie_series (state: State, payload) { state.pie_series = payload },

  total_calls (state: State, payload) { state.total_calls = payload },
  total_calls_fetching (state: State, payload) { state.total_calls_fetching = payload },

  history_fetching (state: State, payload) { state.history_fetching = payload },
  history (state: State, payload) { state.history = payload },
  history_count (state: State, payload) { state.history_count = payload },

  flush (state: State) { Object.assign(state, defaultState()) }
}

export default mutations
