export interface State {
  first_name: string;
  middle_name: string;
  last_name: string;
  login: string;
  password: string;
  phone: string;
  email: string;
  role_id: number;
  group_id: number;
  country_id: number;
}

export function defaultState (): State {
  return {
    email: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    login: '',
    password: '',
    phone: '',
    role_id: 0,
    group_id: 0,
    country_id: 0
  }
}

const state = defaultState()

export default state
