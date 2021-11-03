import { State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  /**
   * Загрузит текущий профиль пользователя.
   *
   * @param state
   * @param payload
   */
  dialer_state (state, payload) { state.dialer_state = payload }
}

export default mutations
