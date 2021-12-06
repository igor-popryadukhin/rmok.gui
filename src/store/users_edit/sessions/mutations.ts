import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  items (state: State, payload) { state.items = payload },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  resetState (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations
