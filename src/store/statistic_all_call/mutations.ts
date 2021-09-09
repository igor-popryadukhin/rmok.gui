import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  history_offset (state: State, payload) { state.history_offset = payload },
  total (state: State, payload) { state.total = payload },
  history (state: State, payload) { state.history = payload },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  resetState (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations
