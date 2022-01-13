import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  process_loading (state: State, payload) { state.process_loading = payload },

  labels (state: State, payload) { state.labels = payload },
  colors (state: State, payload) { state.colors = payload },
  series (state: State, payload) { state.series = payload },

  /** Сброс состояния */
  flush (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations
