import { CurrentProjectInterface, ProjectStateInterface } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProjectStateInterface> = {
  /**
   * Текущий проект пользователя.
   *
   * @param state
   * @param payload
   */
  current (state, payload: CurrentProjectInterface) {
    state.current = payload
  },

  /**
   * Доступные проекты.
   *
   * @param state
   * @param payload
   */
  available (state, payload: CurrentProjectInterface[]) { state.available = payload }
}

export default mutations
