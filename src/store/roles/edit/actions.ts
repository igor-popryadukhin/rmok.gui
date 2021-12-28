import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import { $axios } from '@/plugins/axios'
import APIError from '@/api/classes/APIError'

const actions: ActionTree<State, RootState> = {
  /**
   *
   * @param commit
   * @param rootGetters
   */
  fetch ({ commit, rootGetters }) {
    return new Promise<void>((resolve) => {
      $axios
        .get(`/roles/${rootGetters.routeParams.id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('fill', response.data)
          resolve()
        })
    })
  },

  /**
   * Сохраняет текущее состояние в базе данных
   *
   * @param state
   * @param rootGetters
   */
  save ({ state, rootGetters }) {
    return new Promise<void>((resolve) => {
      $axios
        .patch(`/roles/${rootGetters.routeParams.id}`, {
          name: state.name,
          permissions: state.permissions.filter((value) => value.granted).map((value) => value.id)
        }).then((response) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          resolve()
        })
    })
  }
}

export default actions
