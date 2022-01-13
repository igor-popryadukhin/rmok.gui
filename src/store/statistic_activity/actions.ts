import { ActionContext, ActionTree } from 'vuex'
import { RootState } from '@/store'
import { State } from './state'
import Statistics from '@/api/Statistics'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .activity(params)
        .then((response) => {
          const types = response.meta?.types || 0
          commit('types', types) // Варианты действий пользователя

          commit('activity', response.data)
          resolve()
        }).catch(reject)
    })
  },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param commit
   */
  flush: ({ commit }) => {
    commit('flush')
  }
}

export default actions
