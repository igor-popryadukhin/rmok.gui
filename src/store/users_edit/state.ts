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
    phone: '',
    project: undefined,
    projects: [],
    role: {
      id: 0,
      name: '',
      permissions: []
    },
    permissions: [],
    roles: [],
    tz: '',
    userpic: ''
  }
}

const state = defaultState()

export default state
