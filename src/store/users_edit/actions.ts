import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Users from '@/api/Users'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, rootGetters }) => {
    return new Users()
      .getById(rootGetters.routeParams.user_id)
      .then((response) => {
        commit('id', response.id)
        commit('organization/fill', response.organization)
        commit('permissions', response.permissions)

        commit('pbx_configuration/credentials/fill', response?.pbx_configuration?.credentials)
        commit('pbx_configuration/rtc_configuration/fill', response.pbx_configuration?.rtc_configuration)
      })
  },

  /**
   * Сохраняет текущее состояние параметров телефонии
   * @param state
   */
  save_pbx_configuration: ({ state }) => {
    return new Users()
      .edit(state.id, {
        pbx_configuration: state.pbx_configuration
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
