import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  activity (state: State, payload) { state.activity = payload },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  resetState (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations
