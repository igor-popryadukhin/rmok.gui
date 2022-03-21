import Country from '@/api/interfaces/Country'
import PBXConfiguration from '@/api/interfaces/PBXConfiguration'
import Project from '@/api/interfaces/Project'
import Role from '@/api/interfaces/Role'
import TimeZone from '@/api/interfaces/TimeZone'
import UserGroup from '@/api/interfaces/UserGroup'

export interface ProfileState {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name?: string;
  abbreviation?: string;
  userpic?: string;
  login: string;
  email?: string;
  phone?: string;
  status: 'normal' | 'dnd' | 'away';
  mode?: string;
  contacts_count?: number;
  tz?: TimeZone;
  last_login: number;
  created_at: number;
  country?: Country;
  pbx_configuration?: PBXConfiguration;
  permissions?: Array<Record<string, unknown>>;
  project: Project|null;
  group?: UserGroup;
  role?: Role;
  roles?: Array<Record<string, 'ROLE_ADMIN'|'ROLE_CCM'|'ROLE_TEAM_LEADER'|'ROLE_OPERATOR'>>;
  tasks_pending_number?: number;
}

function state (): ProfileState {
  return {
    contacts_count: 0,
    country: {
      code: '',
      full_name: '',
      id: 0,
      name: ''
    },
    created_at: 0,
    email: '',
    first_name: '',
    id: 0,
    last_login: 0,
    last_name: '',
    login: '',
    middle_name: '',
    full_name: '',
    abbreviation: '',
    phone: '',
    status: 'normal',
    mode: '',
    tz: null,
    userpic: '',
    pbx_configuration: {
      rtc_configuration: {
        bundle_policy: undefined,
        candidate_ready_timeout: 0,
        certificates: [],
        ice_candidate_pool_size: 0,
        ice_servers: [],
        ice_transport_policy: undefined,
        rtcp_mux_policy: 'require'
      },
      credentials: {
        display_name: '',
        login: '',
        password: '',
        port: 0,
        schema: '',
        server: ''
      }
    },
    permissions: [],
    project: null,
    group: null,
    role: null,
    roles: [],
    tasks_pending_number: 0
  }
}

export default state
