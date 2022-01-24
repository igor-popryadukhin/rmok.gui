import { Account } from '@/api/Account'
import APIError from '@/api/classes/APIError'
import { $axios } from '@/plugins/axios'
import { RootState } from '@/store'
import { AxiosResponse } from 'axios'
import { ActionContext, ActionTree } from 'vuex'
import { ProfileState } from './state'
import { RTCIceServer } from '@/store/pbx_configuration/rtc_configuration/state'

const actions: ActionTree<ProfileState, RootState> = {
  fetch ({ commit }) {
    return new Promise<void>((resolve, reject) => {
      $axios.get('/account/profile')
        .then((response: AxiosResponse) => {
          if (response.status !== 200) {
            throw new APIError(response.data)
          }

          commit('fill', response.data)

          resolve()
        }).catch(reject)
    })
  },

  save_pbx_configuration_credentials ({ state }: ActionContext<ProfileState, RootState>): Promise<void> {
    return new Account()
      .updateProfile({
        pbx_configuration: {
          credentials: {
            login: state.pbx_configuration.credentials.login,
            password: state.pbx_configuration.credentials.password,
            schema: state.pbx_configuration.credentials.schema,
            server: state.pbx_configuration.credentials.server,
            port: state.pbx_configuration.credentials.port,
            display_name: state.pbx_configuration.credentials.display_name
          }
        }
      })
  },

  save_pbx_configuration_rtc_configuration ({ state }: ActionContext<ProfileState, RootState>): Promise<void> {
    return new Account()
      .updateProfile({
        pbx_configuration: {
          rtc_configuration: {
            bundle_policy: state.pbx_configuration.rtc_configuration.bundle_policy,
            rtcp_mux_policy: state.pbx_configuration.rtc_configuration.rtcp_mux_policy,
            ice_servers: state.pbx_configuration.rtc_configuration.ice_servers.map((e: RTCIceServer) => {
              if (e.username && e.credential) {
                return e
              }
              return {
                urls: e.urls
              }
            }),
            ice_transport_policy: state.pbx_configuration.rtc_configuration.ice_transport_policy,
            ice_candidate_pool_size: state.pbx_configuration.rtc_configuration.ice_candidate_pool_size,
            certificates: state.pbx_configuration.rtc_configuration.certificates || [],
            candidate_ready_timeout: state.pbx_configuration.rtc_configuration.candidate_ready_timeout
          }
        }
      })
  },

  save_pbx_configuration ({ state }: ActionContext<ProfileState, RootState>): Promise<void> {
    return new Account()
      .updateProfile({
        pbx_configuration: {
          credentials: {
            login: state.pbx_configuration.credentials.login,
            password: state.pbx_configuration.credentials.password,
            scheme: state.pbx_configuration.credentials.schema,
            server: state.pbx_configuration.credentials.server,
            port: state.pbx_configuration.credentials.port,
            display_name: state.pbx_configuration.credentials.display_name
          },
          rtc_configuration: {
            bundle_policy: state.pbx_configuration.rtc_configuration.bundle_policy,
            rtcp_mux_policy: state.pbx_configuration.rtc_configuration.rtcp_mux_policy,
            ice_servers: state.pbx_configuration.rtc_configuration.ice_servers.map((e: RTCIceServer) => {
              if (e.username && e.credential) {
                return e
              }
              return {
                urls: e.urls
              }
            }),
            ice_transport_policy: state.pbx_configuration.rtc_configuration.ice_transport_policy,
            ice_candidate_pool_size: state.pbx_configuration.rtc_configuration.ice_candidate_pool_size,
            certificates: state.pbx_configuration.rtc_configuration.certificates || [],
            candidate_ready_timeout: state.pbx_configuration.rtc_configuration.candidate_ready_timeout
          }
        }
      })
  },

  set_status ({ commit }, payload): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      $axios.get(`/account/status/${payload}`)
        .then((response: AxiosResponse) => {
          if (![204, 200].includes(response.status)) {
            throw new APIError(response.data)
          }

          commit('status', payload)

          resolve()
        }).catch(reject)
    })
  }
}

export default actions
