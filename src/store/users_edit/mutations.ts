import { defaultState, State } from './state'
import { MutationTree } from 'vuex'

const mutations: MutationTree<State> = {
  id (state: State, payload) { state.id = payload },
  full_name (state: State, payload) { state.full_name = payload },
  first_name (state: State, payload) { state.first_name = payload },
  last_name (state: State, payload) { state.last_name = payload },
  middle_name (state: State, payload) { state.middle_name = payload },
  group (state: State, payload) { state.group = payload },
  project (state: State, payload) { state.project = payload },
  projects (state: State, payload) { state.projects = payload },
  role (state: State, payload) { state.role = Object.assign({}, state.role, payload) },
  tz (state: State, payload) { state.tz = payload },
  last_activity_at (state: State, payload) { state.last_activity_at = payload },
  online (state: State, payload) { state.online = payload },
  userpic (state: State, payload) { state.userpic = payload },
  abbreviation (state: State, payload) { state.abbreviation = payload },
  country (state: State, payload) { state.country = Object.assign({}, state.country, payload) },
  email (state: State, payload) { state.email = payload },
  login (state: State, payload) { state.login = payload },
  password (state: State, payload) { state.password = payload },
  pbx_configuration (state: State, payload) { state.pbx_configuration = payload },
  roles (state: State, payload) { state.roles = payload },
  phone (state: State, payload) { state.phone = payload },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  resetState (state: State) {
    Object.assign(state, defaultState())
  }
}

export default mutations
