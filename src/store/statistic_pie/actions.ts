import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { State } from './state'
import Statistics from '@/api/Statistics'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit }: ActionContext<State, RootState>, params = {}) => {
    return new Promise<void>((resolve, reject) => {
      new Statistics()
        .recentCallsPie(params)
        .then((response) => {
          commit('labels', response.labels)
          commit('series', response.series)
          commit('colors', response.colors)
          resolve()
        }).catch(reject)
    })
  },

  resetState: ({ commit }) => {
    commit('resetState')
  }
}

export default actions
