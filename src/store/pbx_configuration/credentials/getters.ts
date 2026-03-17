import { State } from './state';

const getters = {
  login (state: State) { return state.login; },
  password (state: State) { return state.password; },
  port (state: State) { return state.port; },
  server (state: State) { return state.server; },
  schema (state: State) { return state.schema; },
  display_name (state: State) { return state.display_name; }
};

export default getters;
