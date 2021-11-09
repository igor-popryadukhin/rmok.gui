import User from '@/api/interfaces/User'

export interface State extends User {
  [keys: string]: any;
}

export function defaultState (): State {
  return {
    id: 0,
    abbreviation: '',
    country: undefined,
    email: '',
    first_name: '',
    full_name: '',
    group: {
      id: 0,
      name: '',
      responsible: undefined
    },
    last_activity_at: 0,
    last_name: '',
    login: '',
    password: '',
    middle_name: '',
    online: false,
    organization: undefined,
    pbx_configuration: {
      rtc_configuration: {
        certificates: [],
        ice_transport_policy: 'all',
        ice_servers: [],
        ice_candidate_pool_size: 0,
        rtcp_mux_policy: undefined,
        bundle_policy: ''
      },
      credentials: {
        server: '',
        display_name: '',
        login: '',
        password: '',
        port: 8089,
        schema: 'wss'
      }
    },
    phone: '',
    project: undefined,
    projects: [],
    role: {
      id: 0,
      name: '',
      permissions: []
    },
    roles: [],
    tz: '',
    userpic: ''
  }
}

const state = defaultState()

export default state
