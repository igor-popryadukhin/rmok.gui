import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import Statistics from '@/api/Statistics'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .history(params)
        .then((response) => {
          commit('history', response.data)
          commit('client_calls', response.meta?.count || 0)
          resolve()
        }).catch(reject)
    })
  },

  fetchTotalCalls: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .totalCalls(params)
        .then((count) => {
          commit('total_calls', count)
          resolve()
        }).catch(reject)
    })
  }
}

export default actions
