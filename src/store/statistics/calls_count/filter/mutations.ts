import { defaultState, State } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  period (state: State, payload) { state.period = payload; },
  project (state: State, payload) { state.project = payload; },
  users (state: State, payload) { state.users = payload; },
  user_group (state: State, payload) { state.user_group = payload; },
  call_types (state: State, payload) { state.call_types = payload; },

  flush (state: State) { Object.assign(state, defaultState()); }
};

export default mutations;
