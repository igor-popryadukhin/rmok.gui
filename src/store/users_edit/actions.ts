import { RootState } from '@/store'
import { ActionTree } from 'vuex'
import { State } from './state'
import Users from '@/api/Users'

const actions: ActionTree<State, RootState> = {
  fetch: ({ commit, state }, id: number) => {
    return new Promise<void>((resolve, reject) => {
      new Users()
        .getById(id)
        .then((response) => {
          commit('id', response.id)

          commit('pbx_configuration/credentials/display_name', response.pbx_configuration.credentials?.display_name || '')
          commit('pbx_configuration/credentials/login', response.pbx_configuration.credentials?.login || '')
          commit('pbx_configuration/credentials/password', response.pbx_configuration.credentials?.password || '')
          commit('pbx_configuration/credentials/schema', response.pbx_configuration.credentials?.schema || 'wss')
          commit('pbx_configuration/credentials/server', response.pbx_configuration.credentials?.server || '')
          commit('pbx_configuration/credentials/port', response.pbx_configuration.credentials?.port || 443)

          commit('pbx_configuration/rtc_configuration/bundle_policy', response.pbx_configuration?.rtc_configuration?.bundle_policy || [])
          commit('pbx_configuration/rtc_configuration/ice_servers', response.pbx_configuration?.rtc_configuration?.ice_servers || [])
          commit('pbx_configuration/rtc_configuration/ice_transport_policy', response.pbx_configuration?.rtc_configuration?.ice_transport_policy || 'all')
          commit('pbx_configuration/rtc_configuration/ice_candidate_pool_size', response.pbx_configuration?.rtc_configuration?.ice_candidate_pool_size || 0)
          commit('pbx_configuration/rtc_configuration/rtcp_mux_policy', response.pbx_configuration?.rtc_configuration?.rtcp_mux_policy || 'require')
          commit('pbx_configuration/rtc_configuration/certificates', response.pbx_configuration?.rtc_configuration?.certificates || [])

          resolve()
        }).catch(reject)
    })
  },

  save_pbx_configuration: ({ state }) => {
    console.log(state.pbx_configuration)
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
