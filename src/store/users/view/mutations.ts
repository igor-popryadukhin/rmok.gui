import { UsersViewState, defaultState } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<UsersViewState> = {
  user_first_name (state: UsersViewState, payload) { state.user_first_name = payload },
  user_last_name (state: UsersViewState, payload) { state.user_last_name = payload },
  user_middle_name (state: UsersViewState, payload) { state.user_middle_name = payload },
  user_login (state: UsersViewState, payload) { state.user_login = payload },
  user_group (state: UsersViewState, payload) { state.user_group = payload },
  user_role (state: UsersViewState, payload) { state.user_role = payload },
  user_project (state: UsersViewState, payload) { state.user_project = payload },
  user_projects (state: UsersViewState, payload) { state.user_projects = payload },
  user_pbx_configuration (state: UsersViewState, payload) { state.user_pbx_configuration = payload },
  user_pbx_configuration_credentials (state: UsersViewState, payload) { state.user_pbx_configuration.credentials = payload },
  user_pbx_configuration_rtc_configuration (state: UsersViewState, payload) { state.user_pbx_configuration.rtc_configuration = payload },
  user_pbx_configuration_rtc_configuration_ice_servers (state: UsersViewState, payload) { state.user_pbx_configuration.rtc_configuration.ice_servers = payload },
  user_schedule (state: UsersViewState, payload) { state.user_schedule = payload },

  fetching (state: UsersViewState, payload) { state.fetching = payload },
  flush (state: UsersViewState) { Object.assign(state, defaultState()) }
}

export default mutations
