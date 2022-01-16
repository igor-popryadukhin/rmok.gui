import { RootState } from '@/store'
import { UsersViewState } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<UsersViewState, RootState> = {
  user_first_name (state: UsersViewState) { return state.user_first_name },
  user_last_name (state: UsersViewState) { return state.user_last_name },
  user_middle_name (state: UsersViewState) { return state.user_middle_name },
  user_login (state: UsersViewState) { return state.user_login },
  user_group (state: UsersViewState) { return state.user_group },
  user_role (state: UsersViewState) { return state.user_role },
  user_project (state: UsersViewState) { return state.user_project },
  user_projects (state: UsersViewState) { return state.user_projects },
  user_pbx_configuration (state: UsersViewState) { return state.user_pbx_configuration },
  user_pbx_configuration_rtc_configuration_ice_servers (state: UsersViewState) { return state.user_pbx_configuration.rtc_configuration.ice_servers },
  user_schedule (state: UsersViewState) { return state.user_schedule },

  fetching (state: UsersViewState) { return state.fetching }
}

export default getters
