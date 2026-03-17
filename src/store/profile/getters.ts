import { RootState } from '@/store';
import { ProfileState } from './state';

import { GetterTree } from 'vuex';

const getters: GetterTree<ProfileState, RootState> = {
  profile (state: ProfileState): ProfileState { return Object.assign({}, state); },
  first_name (state: ProfileState) { return state.first_name; },
  last_name (state: ProfileState) { return state.last_name; },
  middle_name (state: ProfileState) { return state.middle_name; },
  login (state: ProfileState) { return state.login; },
  email (state: ProfileState) { return state.email; },
  mode (state: ProfileState) { return state.mode; },
  profile_tz (state: ProfileState) { return state.tz; },
  permissions (state: ProfileState) { return state.permissions; },
  roles (state: ProfileState) { return state.roles; },
  tasks_pending_number (state: ProfileState) { return state.tasks_pending_number; },
  pbx_configuration (state: ProfileState) { return state.pbx_configuration; },
  pbx_configuration_credentials (state: ProfileState) { return state.pbx_configuration.credentials; },
  pbx_configuration_rtc_configuration (state: ProfileState) { return state.pbx_configuration.rtc_configuration; },
  pbx_configuration_rtc_configuration_ice_servers (state: ProfileState) { return state.pbx_configuration?.rtc_configuration?.ice_servers || []; },
  current_project (state: ProfileState) { return state.project; }
};

export default getters;
