import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  pie_fetching (state: State, payload) { state.pie_fetching = payload },
  pie_labels (state: State, payload) { state.pie_labels = payload },
  pie_colors (state: State, payload) { state.pie_colors = payload },
  pie_series (state: State, payload) { state.pie_series = payload },

  history_fetching (state: State, payload) { state.history_fetching = payload },
  history (state: State, payload) { state.history = payload }
}

export default mutations
