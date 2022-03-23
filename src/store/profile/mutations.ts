import User from '@/api/interfaces/User'
import { ProfileState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<ProfileState> = {
  first_name (state, payload) { state.first_name = payload },
  last_name (state, payload) { state.last_name = payload },
  middle_name (state, payload) { state.middle_name = payload },
  login (state, payload) { state.login = payload },
  email (state, payload) { state.email = payload },
  status (state, payload) { state.status = payload },
  pbx_configuration_credentials (state, payload) { state.pbx_configuration.credentials = payload },
  pbx_configuration_rtc_configuration (state, payload) { state.pbx_configuration.rtc_configuration = payload },
  pbx_configuration_rtc_configuration_ice_servers (state, payload) { state.pbx_configuration.rtc_configuration.ice_servers = payload },

  /**
   *
   * @param state
   * @param payload
   */
  fill (state, payload) {
    state.id = payload.id
    state.uuid = payload.uuid
    state.first_name = payload.first_name
    state.last_name = payload.last_name
    state.middle_name = payload.middle_name
    state.full_name = payload.full_name
    state.abbreviation = payload.abbreviation
    state.country = payload.country
    state.phone = payload.phone
    state.email = payload.email
    state.login = payload.login
    state.tz = payload.tz
    state.group = payload.group
    state.status = payload.status
    state.mode = payload.mode
    state.permissions = payload.permissions
    state.project = payload.project
    state.role = payload.role
    state.roles = payload.roles
    state.tasks_pending_number = payload.tasks_pending_number

    if (payload?.pbx_configuration?.rtc_configuration) {
      state.pbx_configuration.rtc_configuration = payload.pbx_configuration.rtc_configuration
    }

    if (payload?.pbx_configuration?.credentials) {
      state.pbx_configuration.credentials = payload.pbx_configuration.credentials
    }
  }
}

export default mutations
