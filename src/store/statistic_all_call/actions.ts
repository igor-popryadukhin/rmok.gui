import { ActionContext, ActionTree } from 'vuex'
import { RootState } from '@/store'
import { State } from './state'
import Statistics from '@/api/Statistics'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .allCallsHistory(params)
        .then((response) => {
          commit('history', response.data)
          commit('total', response.meta?.count || 0)
          resolve()
        }).catch(reject)
    })
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
