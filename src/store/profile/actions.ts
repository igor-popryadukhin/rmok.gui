import { Account } from '@/api/Account'
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ProfileState } from './state'
import { State } from '@/store/pbx_configuration/state'
import { RTCIceServer } from '@/store/pbx_configuration/rtc_configuration/state'

const actions: ActionTree<ProfileState, RootState> = {
  load ({ commit }: ActionContext<ProfileState, RootState>) {
    return new Account()
      .getProfile()
      .then((response) => {
        commit('fill', response)
        commit('organization/fill', response.organization)
        if (response.project) { commit('project/fill', response.project) }
        commit('pbx_configuration/credentials/fill', response?.pbx_configuration?.credentials)
        commit('pbx_configuration/rtc_configuration/fill', response?.pbx_configuration?.rtc_configuration)
      })
  },

  save_pbx_configuration_credentials ({ state }: ActionContext<State, RootState>): Promise<void> {
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

  save_pbx_configuration_rtc_configuration ({ state }: ActionContext<State, RootState>): Promise<void> {
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

  save_pbx_configuration ({ state }: ActionContext<State, RootState>): Promise<void> {
    return new Account()
      .updateProfile({
        pbx_configuration: {
          credentials: {
            login: state.pbx_configuration.credentials.login,
            password: state.pbx_configuration.credentials.password,
            scheme: state.pbx_configuration.credentials.scheme,
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

  set_status (ctx: ActionContext<ProfileState, RootState>, payload): Promise<void> {
    return new Account().setStatus(payload)
  }
}

export default actions
