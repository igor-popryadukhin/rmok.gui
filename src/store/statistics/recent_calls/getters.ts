import { RootState } from '@/store'
import { State } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<State, RootState> = {
  pie_fetching (state: State) { return state.pie_fetching },
  pie_labels (state: State) { return state.pie_labels },
  pie_colors (state: State) { return state.pie_colors },
  pie_series (state: State) { return state.pie_series },

  history_fetching (state: State) { return state.history_fetching },
  history (state: State) { return state.history }
}

export default getters
