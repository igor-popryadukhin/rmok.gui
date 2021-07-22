import Country from '@/api/interfaces/Country'
import Organization from '@/api/interfaces/Organization'
import Role from '@/api/interfaces/Role'

export interface ProfileState {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  userpic?: string;
  login: string;
  email?: string;
  phone?: string;
  status?: string;
  contacts_count?: number;
  tz?: string;
  last_login: number;
  role: Role;
  organization?: Organization;
  created_at: number;
  country?: Country;
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
    phone: '',
    role: {
      id: 0,
      name: '',
      permissions: []
    },
    organization: {
      id: 0,
      address: '',
      city: '',
      cpp: '',
      description: '',
      email: '',
      inn: '',
      name: '',
      phone: '',
      region: '',
      site: '',
      sphere_activity: ''
    },
    status: '',
    tz: '',
    userpic: ''
  }
}

export default state
