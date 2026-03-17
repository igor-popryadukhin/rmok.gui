import { defaultState, State } from './state';

const mutations = {
  first_name (state: State, payload) { state.first_name = payload; },
  last_name (state: State, payload) { state.last_name = payload; },
  middle_name (state: State, payload) { state.middle_name = payload; },
  login (state: State, payload) { state.login = payload; },
  password (state: State, payload) { state.password = payload; },
  phone (state: State, payload) { state.phone = payload; },
  email (state: State, payload) { state.email = payload; },
  role_id (state: State, payload) { state.role_id = payload; },
  country_id (state: State, payload) { state.country_id = payload; },
  group_id (state: State, payload) { state.group_id = payload; },

  /**
   * Сбрасывает до состояния по умолчанию.
   * @param state
   */
  flush (state: State) {
    Object.assign(state, defaultState());
  }
};

export default mutations;
