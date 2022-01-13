import Country from '@/api/interfaces/Country'
import PBXConfiguration from '@/api/interfaces/PBXConfiguration'
import Project from '@/api/interfaces/Project'
import UserGroup from '@/api/interfaces/UserGroup'

export interface State {
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
  status?: string;
  mode?: string;
  contacts_count?: number;
  tz?: string;
  last_login: number;
  created_at: number;
  country?: Country;
  pbx_configuration?: PBXConfiguration;
  permissions?: Array<Record<string, unknown>>;
  project: Project|null;
  group?: UserGroup;
}

function state (): State {
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
    status: '',
    mode: '',
    tz: '',
    userpic: '',
    pbx_configuration: null,
    permissions: [],
    project: null,
    group: undefined
  }
}

export default state
