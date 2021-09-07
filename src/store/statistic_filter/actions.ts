import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'

const actions: ActionTree<State, RootState> = {
  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
