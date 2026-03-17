import PBXConfiguration from '@/api/interfaces/PBXConfiguration';
import Project from '@/api/interfaces/Project';
import Role from '@/api/interfaces/Role';
import UserGroup from '@/api/interfaces/UserGroup';
import UserSchedule from '@/api/interfaces/UserSchedule';

export interface UsersViewState {
  fetching: boolean;

  user_first_name: string;
  user_last_name: string;
  user_middle_name: string;
  user_login: string;
  user_password: string|null;
  user_groups: UserGroup[];
  user_role: Role|null;
  user_project: Project|null;
  user_projects: Project[];
  user_pbx_configuration: PBXConfiguration;
  user_schedule: UserSchedule[];
}

export function defaultState (): UsersViewState {
  return {
    fetching: false,

    user_first_name: '',
    user_last_name: '',
    user_middle_name: '',
    user_login: '',
    user_password: null,
    user_groups: [],
    user_role: null,
    user_project: null,
    user_projects: null,
    user_pbx_configuration: {
      credentials: {
        display_name: '',
        login: '',
        password: '',
        port: 0,
        schema: '',
        server: ''
      },
      rtc_configuration: {
        bundle_policy: undefined,
        candidate_ready_timeout: 0,
        certificates: [],
        ice_candidate_pool_size: 0,
        ice_servers: [],
        ice_transport_policy: undefined,
        rtcp_mux_policy: 'require'
      }
    },
    user_schedule: []
  };
}

const state = defaultState;

export default state;
