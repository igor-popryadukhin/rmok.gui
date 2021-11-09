import { Account } from '@/api/Account'
import { RootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ProfileState } from './state'
import { State } from '@/store/pbx_configuration/state'

const actions: ActionTree<ProfileState, RootState> = {
  load (ctx: ActionContext<ProfileState, RootState>): Promise<void> {
    return new Promise((resolve) => {
      new Account()
        .getProfile()
        .then((response) => {
          ctx.commit('fill', response)

          // Credentials
          ctx.commit('pbx_configuration/credentials/display_name', response.pbx_configuration.credentials?.display_name || '')
          ctx.commit('pbx_configuration/credentials/login', response.pbx_configuration.credentials?.login || '')
          ctx.commit('pbx_configuration/credentials/password', response.pbx_configuration.credentials?.password || '')
          ctx.commit('pbx_configuration/credentials/schema', response.pbx_configuration.credentials?.schema || 'wss')
          ctx.commit('pbx_configuration/credentials/server', response.pbx_configuration.credentials?.server || '')
          ctx.commit('pbx_configuration/credentials/port', response.pbx_configuration.credentials?.port || 443)

          // RTC Config
          ctx.commit('pbx_configuration/rtc_configuration/rtcp_mux_policy', response.pbx_configuration.rtc_configuration.rtcp_mux_policy)
          ctx.commit('pbx_configuration/rtc_configuration/bundle_policy', response.pbx_configuration.rtc_configuration.bundle_policy)
          ctx.commit('pbx_configuration/rtc_configuration/ice_candidate_pool_size', response.pbx_configuration.rtc_configuration.ice_candidate_pool_size)
          ctx.commit('pbx_configuration/rtc_configuration/ice_servers', response.pbx_configuration.rtc_configuration.ice_servers)
          ctx.commit('pbx_configuration/rtc_configuration/ice_transport_policy', response.pbx_configuration.rtc_configuration.ice_transport_policy)
          ctx.commit('pbx_configuration/rtc_configuration/certificates', response.pbx_configuration.rtc_configuration.certificates || [])

          resolve()
        })
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
            ice_servers: state.pbx_configuration.rtc_configuration.ice_servers,
            ice_transport_policy: state.pbx_configuration.rtc_configuration.ice_transport_policy,
            ice_candidate_pool_size: state.pbx_configuration.rtc_configuration.ice_candidate_pool_size,
            certificates: state.pbx_configuration.rtc_configuration.certificates || []
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
            ice_servers: state.pbx_configuration.rtc_configuration.ice_servers,
            ice_transport_policy: state.pbx_configuration.rtc_configuration.ice_transport_policy,
            ice_candidate_pool_size: state.pbx_configuration.rtc_configuration.ice_candidate_pool_size,
            certificates: state.pbx_configuration.rtc_configuration.certificates || []
          }
        }
      })
  },

  set_status (ctx: ActionContext<ProfileState, RootState>, payload): Promise<void> {
    return new Account().setStatus(payload)
  }
}

export default actions
