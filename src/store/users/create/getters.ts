import { State } from './state'

const getters = {
  first_name (state: State) { return state.first_name },
  last_name (state: State) { return state.last_name },
  middle_name (state: State) { return state.middle_name },
  email (state: State) { return state.email },
  login (state: State) { return state.login },
  password (state: State) { return state.password },
  phone (state: State) { return state.phone },
  role_id (state: State) { return state.role_id },
  country_id (state: State) { return state.country_id },
  group_id (state: State) { return state.group_id }
}

export default getters
